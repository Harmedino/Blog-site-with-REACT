import { useEffect, useRef, useState, type DragEvent } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Bold, Code, Eye, Heading2, ImagePlus, Italic, Link2, List, Pencil, Quote, X } from "lucide-react";
import { usePost, useSavePost } from "@/features/posts/api";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Markdown } from "@/components/ui/markdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { PageSpinner } from "@/components/layout/PageSpinner";
import { CATEGORY_NAMES } from "@/lib/categories";
import { errorMessage } from "@/lib/api";
import { cn, readingTime, wordCount } from "@/lib/utils";
import { pageTitle } from "@/lib/seo";
import type { Post } from "@/types";

const MIN_WORDS = 30;
const MAX_IMAGE_MB = 5;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DRAFT_KEY = "draft:new-post";

const schema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120, "Keep the title under 120 characters"),
  excerpt: z.string().trim().max(200, "Keep the summary under 200 characters"),
  body: z.string().refine((v) => wordCount(v) >= MIN_WORDS, `Write at least ${MIN_WORDS} words`),
  category: z.string().refine((v) => CATEGORY_NAMES.includes(v), "Pick a category"),
  date: z.string().min(1, "Pick a publication date"),
  tags: z.string(),
});

type FormValues = z.infer<typeof schema>;

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

const emptyValues = (): FormValues => ({ title: "", excerpt: "", body: "", category: "", date: today(), tags: "" });

const fromPost = (p: Post): FormValues => ({
  title: p.title,
  excerpt: p.excerpt ?? "",
  body: p.body,
  category: p.category,
  date: p.date,
  tags: (p.tags ?? []).join(", "),
});

function loadDraft(): FormValues | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...emptyValues(), ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

/** Markdown toolbar actions: wrap the selection, or prefix the current line. */
const TOOLS = [
  { icon: Bold, label: "Bold", wrap: ["**", "**"], placeholder: "bold text" },
  { icon: Italic, label: "Italic", wrap: ["_", "_"], placeholder: "italic text" },
  { icon: Heading2, label: "Heading", prefix: "## ", placeholder: "Heading" },
  { icon: Quote, label: "Quote", prefix: "> ", placeholder: "Quote" },
  { icon: List, label: "Bulleted list", prefix: "- ", placeholder: "List item" },
  { icon: Code, label: "Code", wrap: ["`", "`"], placeholder: "code" },
  { icon: Link2, label: "Link", wrap: ["[", "](https://)"], placeholder: "link text" },
] as const;

function EditorForm({ post }: { post?: Post }) {
  const isEdit = !!post;
  const navigate = useNavigate();
  const { user } = useAuth();
  const save = useSavePost(post?._id);

  const [draft] = useState(() => (isEdit ? null : loadDraft()));
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: post ? fromPost(post) : (draft ?? emptyValues()),
  });

  const values = useWatch({ control });
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image ?? null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  // Where to go after a successful save (see the effect below useBlocker).
  const [savedTo, setSavedTo] = useState<string | null>(null);

  // Tell the user a draft was restored, with an option to discard it.
  useEffect(() => {
    if (!draft) return;
    toast.info("Restored your unsaved draft", {
      id: "draft-restored",
      action: {
        label: "Discard",
        onClick: () => {
          localStorage.removeItem(DRAFT_KEY);
          reset(emptyValues());
        },
      },
    });
  }, [draft, reset]);

  // Autosave new posts as a local draft.
  useEffect(() => {
    if (isEdit || !isDirty || savedTo) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* storage full or unavailable — draft just isn't saved */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [values, isEdit, isDirty, savedTo]);

  // Revoke object URLs we created for the preview.
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const hasUnsaved = (isDirty || !!image) && !savedTo;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsaved && currentLocation.pathname !== nextLocation.pathname,
  );

  // Must stay below useBlocker: effects run in order, so the blocker has
  // already been updated to "nothing unsaved" when this navigates.
  useEffect(() => {
    if (savedTo) navigate(savedTo);
  }, [savedTo, navigate]);

  useEffect(() => {
    if (!hasUnsaved) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsaved]);

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) return setImageError("Use a JPG, PNG, WebP or GIF image.");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setImageError(`Image must be under ${MAX_IMAGE_MB}MB.`);
    setImageError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickImage(e.dataTransfer.files[0]);
  };

  const applyTool = (tool: (typeof TOOLS)[number]) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end) || tool.placeholder;
    let insert: string;
    let cursorStart: number;
    if ("wrap" in tool) {
      insert = tool.wrap[0] + selected + tool.wrap[1];
      cursorStart = start + tool.wrap[0].length;
    } else {
      const atLineStart = start === 0 || value[start - 1] === "\n";
      const lead = atLineStart ? "" : "\n";
      insert = lead + tool.prefix + selected;
      cursorStart = start + lead.length + tool.prefix.length;
    }
    setValue("body", value.slice(0, start) + insert + value.slice(end), { shouldDirty: true, shouldValidate: !!errors.body });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorStart + selected.length);
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!isEdit && !image) {
      setImageError("Add a cover image.");
      return;
    }
    if (!user) {
      toast.error("Still loading your account — try again in a moment.");
      return;
    }
    try {
      const res = await save.mutateAsync({ ...data, author: user.username, authorId: user._id, image });
      localStorage.removeItem(DRAFT_KEY);
      toast.success(isEdit ? "Post updated" : "Post published 🎉");
      const savedId = "blog" in res ? res.blog?._id : res.result?._id;
      setSavedTo(savedId ? `/blog/${savedId}` : "/dashboard");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  });

  const body = values.body ?? "";
  const words = wordCount(body);
  const tags = (values.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const { ref: bodyRegisterRef, ...bodyField } = register("body");

  return (
    <div className="container-page py-10">
      <title>{pageTitle(isEdit ? "Edit post" : "Write a post")}</title>

      <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">{isEdit ? "Edit post" : "Write a new post"}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {isEdit ? "Update your post below." : "Drafts save automatically on this device while you write."}
            </p>
          </div>

          <Field label="Title" htmlFor="title" required error={errors.title?.message} aside={`${values.title?.length ?? 0}/120`}>
            <Input
              id="title"
              maxLength={120}
              placeholder="A title that makes people want to click"
              invalid={!!errors.title}
              className="font-serif text-lg font-semibold"
              {...register("title")}
            />
          </Field>

          <Field
            label="Summary"
            htmlFor="excerpt"
            error={errors.excerpt?.message}
            hint="Shown on article cards. Leave empty to use the start of your post."
            aside={`${values.excerpt?.length ?? 0}/200`}
          >
            <Textarea id="excerpt" rows={2} maxLength={200} placeholder="One or two sentences about the post" invalid={!!errors.excerpt} {...register("excerpt")} />
          </Field>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <label htmlFor="body" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Content<span className="ml-0.5 text-red-500">*</span>
              </label>
              <span className="text-xs text-zinc-500">
                {words} words · {readingTime(body)} min read
              </span>
            </div>
            <div
              className={cn(
                "overflow-hidden rounded-xl border bg-white dark:bg-zinc-900",
                errors.body ? "border-red-500" : "border-zinc-300 dark:border-zinc-700",
              )}
            >
              <div className="flex items-center gap-1 border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
                <div role="tablist" className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
                  {(["write", "preview"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={tab === t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium capitalize",
                        tab === t ? "bg-white shadow-sm dark:bg-zinc-700" : "text-zinc-500",
                      )}
                    >
                      {t === "write" ? <Pencil className="size-3" /> : <Eye className="size-3" />} {t}
                    </button>
                  ))}
                </div>
                {tab === "write" && (
                  <div className="ml-2 flex flex-wrap items-center">
                    {TOOLS.map((tool) => (
                      <button
                        key={tool.label}
                        type="button"
                        onClick={() => applyTool(tool)}
                        title={tool.label}
                        aria-label={tool.label}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        <tool.icon className="size-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {tab === "write" ? (
                <textarea
                  id="body"
                  rows={20}
                  placeholder={"Tell your story…\n\nMarkdown works here: **bold**, _italic_, ## headings, - lists, [links](https://…)"}
                  aria-invalid={!!errors.body || undefined}
                  className="block w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-relaxed focus:outline-none"
                  ref={(el) => {
                    bodyRegisterRef(el);
                    bodyRef.current = el;
                  }}
                  {...bodyField}
                />
              ) : (
                <div className="min-h-[30rem] px-5 py-4">
                  {body.trim() ? <Markdown>{body}</Markdown> : <p className="text-sm text-zinc-500">Nothing to preview yet.</p>}
                </div>
              )}
            </div>
            {errors.body ? (
              <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.body.message}
                {words < MIN_WORDS && ` (${MIN_WORDS - words} to go)`}
              </p>
            ) : (
              <p className="text-xs text-zinc-500">Supports Markdown, including tables and code blocks.</p>
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <Field label="Category" htmlFor="category" required error={errors.category?.message}>
              <Select id="category" invalid={!!errors.category} {...register("category")}>
                <option value="" disabled>
                  Choose a category
                </option>
                {CATEGORY_NAMES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Publication date" htmlFor="date" required error={errors.date?.message}>
              <Input id="date" type="date" invalid={!!errors.date} {...register("date")} />
            </Field>

            <Field label="Tags" htmlFor="tags" hint="Separate with commas">
              <Input id="tags" placeholder="react, career, lagos" {...register("tags")} />
            </Field>
            {tags.length > 0 && (
              <div className="-mt-2 flex flex-wrap gap-1.5">
                {tags.map((t, i) => (
                  <span key={`${t}-${i}`} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-500/15 dark:text-brand-200">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <p className="text-sm font-medium">
              Cover image{!isEdit && <span className="ml-0.5 text-red-500">*</span>}
            </p>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "relative flex aspect-[16/10] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors",
                dragging ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : imageError ? "border-red-500" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700",
              )}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Cover preview" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute right-2 bottom-2 rounded-full bg-zinc-950/70 px-3 py-1 text-xs font-medium text-white">Change</span>
                </>
              ) : (
                <>
                  <ImagePlus className="size-7 text-zinc-400" />
                  <span className="mt-2 text-sm font-medium">Drop an image or click to upload</span>
                  <span className="text-xs text-zinc-500">JPG, PNG, WebP or GIF · up to {MAX_IMAGE_MB}MB</span>
                </>
              )}
              <input type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={(e) => pickImage(e.target.files?.[0])} />
            </label>
            {image && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                onClick={() => {
                  setImage(null);
                  setImagePreview(post?.image ?? null);
                }}
              >
                <X className="size-3" /> Remove {image.name}
              </button>
            )}
            {imageError && (
              <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                {imageError}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="lg" className="flex-1" loading={save.isPending}>
              {save.isPending ? (isEdit ? "Saving…" : "Publishing…") : isEdit ? "Save changes" : "Publish"}
            </Button>
            <Link to={isEdit ? `/blog/${post._id}` : "/dashboard"} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Cancel
            </Link>
          </div>
        </aside>
      </form>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="Leave without saving?"
        description={isEdit ? "Your changes to this post will be lost." : "Your draft is saved on this device, but your cover image isn't."}
        confirmLabel="Leave"
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  );
}

export default function EditorPage() {
  const { id } = useParams();
  const { user, isLoadingUser } = useAuth();
  const { data: post, isPending } = usePost(id);

  if (!id) return <EditorForm />;
  if (isPending || isLoadingUser) {
    return (
      <div className="container-page space-y-4 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!post) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Post not found" action={<Link to="/dashboard" className={buttonVariants()}>Back to dashboard</Link>} />
      </div>
    );
  }
  if (!user) return <PageSpinner />;
  if (post.publisher !== user._id) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="You can only edit your own posts"
          action={<Link to={`/blog/${post._id}`} className={buttonVariants()}>View the post</Link>}
        />
      </div>
    );
  }
  // `key` remounts the form if you navigate from one post's editor to another's.
  return <EditorForm key={post._id} post={post} />;
}
