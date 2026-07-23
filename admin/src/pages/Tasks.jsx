import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [projectId, setProjectId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");



  useEffect(() => {

    fetchTasks();

  }, []);




  function showMessage(text) {

    setMessage(text);

    setTimeout(() => {

      setMessage("");

    }, 3000);

  }





  async function fetchTasks() {

    setLoading(true);
    setError("");

    try {

      const response = await api.get("/tasks");

      setTasks(response.data);



    } catch (error) {


      console.log(error);

      setError("Failed to load tasks.");



    } finally {


      setLoading(false);


    }

  }







  async function createTask() {

    setMessage("");
    setError("");


    if (title.trim() === "") {

      showMessage("❌ Task title is required.");

      return;

    }


    if (description.trim() === "") {

      showMessage("❌ Task description is required.");

      return;

    }


    if (projectId.trim() === "") {

      showMessage("❌ Project ID is required.");

      return;

    }




    try {


      await api.post(

        "/tasks",

        {

          Title: title,

          Description: description,

          Status: status,

          Project_id: projectId,

         

        }

      );


      showMessage("✅ Task created successfully!");



      setTitle("");

      setDescription("");

      setStatus("Pending");

      setProjectId("");



      fetchTasks();



    } catch (error) {


      console.log(error);


      showMessage(
        "❌ " + (error.response?.data?.message || "Failed to create task.")
      );


    }

  }








  function editTask(task) {


    setEditingId(task.Task_id);

    setTitle(task.Title);

    setDescription(task.Description);

    setStatus(task.Status);

    setProjectId(String(task.Project_id));


  }







  async function updateTask() {

    setMessage("");
    setError("");


    try {


      await api.put(

        `/tasks/${editingId}`,

        {

          Title: title,

          Description: description,

          Status: status,

          Project_id: projectId

        }

      );



      showMessage("✅ Task updated successfully!");



      setEditingId(null);

      setTitle("");

      setDescription("");

      setStatus("Pending");

      setProjectId("");



      fetchTasks();



    } catch(error) {


      console.log(error);

      showMessage("❌ Failed to update task.");


    }

  }








  async function deleteTask(id) {


    const confirmDelete = window.confirm(

      "Are you sure you want to delete this task?"

    );



    if (!confirmDelete) {

      return;

    }





    try {


      await api.delete(`/tasks/${id}`);



      showMessage("✅ Task deleted successfully!");



      fetchTasks();




    } catch(error) {


      console.log(error);

      showMessage("❌ Failed to delete task.");


    }

  }









  return (


    <div style={{ padding: "30px" }}>


      <h1>Tasks</h1>



      <h2>
        {editingId ? "Edit Task" : "Create Task"}
      </h2>




      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />


      <br /><br />



      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />



      <input
        type="text"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />

      <br /><br />



      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >

        <option value="Pending">
          Pending
        </option>

        <option value="In Progress">
          In Progress
        </option>

        <option value="Completed">
          Completed
        </option>

      </select>


      <br /><br />



      {
        editingId ? (

          <button onClick={updateTask}>
            Update Task
          </button>

        ) : (

          <button onClick={createTask}>
            Create Task
          </button>

        )
      }



      {message && (

        <p
          style={{
            color: message.startsWith("✅") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>

      )}






      <h2>Task List</h2>




      {loading && (
        <p>Loading tasks...</p>
      )}



      {error && (
        <p>{error}</p>
      )}





      {!loading && tasks.length === 0 ? (

        <p>No tasks found.</p>

      ) : (

        !loading && (

          <table border="1" cellPadding="10">

            <thead>

              <tr>

                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Project ID</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {
                tasks.map((task) => (

                  <tr key={task.Task_id}>

                    <td>{task.Task_id}</td>

                    <td>{task.Title}</td>

                    <td>{task.Description}</td>

                    <td>{task.Status}</td>

                    <td>{task.Project_id}</td>


                    <td>

                      <button onClick={() => editTask(task)}>
                        Edit
                      </button>

                      {" "}

                      <button onClick={() => deleteTask(task.Task_id)}>
                        Delete
                      </button>

                    </td>


                  </tr>

                ))
              }

            </tbody>


          </table>

        )

      )}



    </div>

  );

}


export default Tasks;