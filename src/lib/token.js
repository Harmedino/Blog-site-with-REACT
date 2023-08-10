import axios from "axios";

export async function activeUser() {
  let token = localStorage.getItem("authToken");

  if (token) {
    try {
      const response = await axios.post(
        "http://localhost:5000/verifyToken",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      // Handle errors here
      console.log(error);
    }
  }
}
