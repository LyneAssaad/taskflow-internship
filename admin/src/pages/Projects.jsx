import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {

  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");



  useEffect(() => {

    fetchProjects();

  }, []);




  function showMessage(text) {

    setMessage(text);

    setTimeout(() => {

      setMessage("");

    }, 3000);

  }





  async function fetchProjects() {

    setLoading(true);
    setError("");

    try {

      const response = await api.get("/projects");

      setProjects(response.data);


    } catch (error) {

      console.log(error);

      setError("Failed to load projects.");

    } finally {

      setLoading(false);

    }

  }





  async function createProject() {

    setMessage("");
    setError("");

    if (name.trim() === "") {

      showMessage("❌ Project name is required.");

      return;

    }


    if (description.trim() === "") {

      showMessage("❌ Project description is required.");

      return;

    }



    try {


      await api.post(

        "/projects",

        {
          Name: name,
          Description: description,
         
        }

      );


      showMessage("✅ Project created successfully!");


      setName("");

      setDescription("");

      fetchProjects();



    } catch (error) {


      console.log(error);

      showMessage(
        "❌ " + (error.response?.data?.message || "Failed to create project.")
      );


    }

  }






  function editProject(project) {


    setEditingId(project.Project_id);

    setName(project.Name);

    setDescription(project.Description);


  }






  async function updateProject() {


    try {


      await api.put(

        `/projects/${editingId}`,

        {
          Name: name,
          Description: description,
        }

      );


      showMessage("✅ Project updated successfully!");


      setEditingId(null);

      setName("");

      setDescription("");

      fetchProjects();



    } catch(error) {


      console.log(error);

      showMessage(
        "❌ Failed to update project."
      );


    }

  }







  async function deleteProject(id) {


    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );


    if (!confirmDelete) {

      return;

    }



    try {


      await api.delete(`/projects/${id}`);


      showMessage("✅ Project deleted successfully!");


      fetchProjects();



    } catch(error) {


      console.log(error);

      showMessage(
        "❌ Failed to delete project."
      );


    }

  }







  return (

    <div style={{ padding: "30px" }}>


      <h1>Projects</h1>



      <h2>
        {editingId ? "Edit Project" : "Create Project"}
      </h2>





      <input

        type="text"

        placeholder="Project name"

        value={name}

        onChange={(e) => setName(e.target.value)}

      />



      <br /><br />



      <textarea

        placeholder="Project description"

        value={description}

        onChange={(e) => setDescription(e.target.value)}

      />



      <br /><br />





      {
        editingId ? (

          <button onClick={updateProject}>

            Update Project

          </button>


        ) : (

          <button onClick={createProject}>

            Create Project

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





      <h2>Project List</h2>




      {loading && (

        <p>Loading projects...</p>

      )}






      {error && (

        <p>{error}</p>

      )}







      {!loading && projects.length === 0 ? (

        <p>No projects found.</p>

      ) : (

        !loading && (

          <table border="1" cellPadding="10">

            <thead>

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Description</th>

                <th>Actions</th>

              </tr>

            </thead>



            <tbody>

              {
                projects.map((project) => (

                  <tr key={project.Project_id}>

                    <td>{project.Project_id}</td>

                    <td>{project.Name}</td>

                    <td>{project.Description}</td>

                    <td>

                      <button
                        onClick={() => editProject(project)}
                      >
                        Edit
                      </button>


                      {" "}


                      <button
                        onClick={() => deleteProject(project.Project_id)}
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

      )}



    </div>

  );

}


export default Projects;