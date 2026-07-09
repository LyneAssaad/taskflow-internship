import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [projectId, setProjectId] = useState("");

  const [editingId, setEditingId] = useState(null);



  useEffect(() => {
    fetchTasks();
  }, []);



  async function fetchTasks() {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/tasks", {
        headers: {
          authorization: token,
        },
      });


      setTasks(response.data);


    } catch (error) {

      console.log(error);

    }

  }



  async function createTask() {

    try {

      const token = localStorage.getItem("token");


      await api.post(
        "/tasks",
        {
          Title: title,
          Description: description,
          Status: status,
          Project_id: projectId,
          User_id: 1
        },
        {
          headers: {
            authorization: token,
          },
        }
      );


      setTitle("");
      setDescription("");
      setStatus("Pending");
      setProjectId("");

      fetchTasks();


    } catch (error) {

      console.log(error);

    }

  }




  function editTask(task) {

    setEditingId(task.Task_id);
    setTitle(task.Title);
    setDescription(task.Description);
    setStatus(task.Status);
    setProjectId(task.Project_id);

  }





  async function updateTask() {

    try {

      const token = localStorage.getItem("token");


      await api.put(
        `/tasks/${editingId}`,
        {
          Title: title,
          Description: description,
          Status: status
        },
        {
          headers: {
            authorization: token,
          },
        }
      );


      setEditingId(null);
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setProjectId("");

      fetchTasks();


    } catch(error) {

      console.log(error);

    }

  }





  async function deleteTask(id) {

    try {

      const token = localStorage.getItem("token");


      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );


      if (!confirmDelete) {
        return;
      }



      await api.delete(`/tasks/${id}`, {

        headers: {

          authorization: token,

        },

      });



      fetchTasks();



    } catch(error) {

      console.log(error);

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






      <h2>Task List</h2>



      {
        tasks.length === 0 ? (

          <p>No tasks found.</p>

        ) : (


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


                    <td>
                      {task.Task_id}
                    </td>


                    <td>
                      {task.Title}
                    </td>


                    <td>
                      {task.Description}
                    </td>


                    <td>
                      {task.Status}
                    </td>


                    <td>
                      {task.Project_id}
                    </td>



                    <td>


                      <button
                        onClick={() => editTask(task)}
                      >
                        Edit
                      </button>



                      {" "}



                      <button
                        onClick={() => deleteTask(task.Task_id)}
                      >
                        Delete
                      </button>



                    </td>


                  </tr>


                ))
              }


            </tbody>


          </table>


        )
      }



    </div>

  );

}


export default Tasks;