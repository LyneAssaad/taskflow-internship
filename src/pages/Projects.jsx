import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    fetchProjects();
  }, []);


  async function fetchProjects() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/projects", {
        headers: {
          authorization: token,
        },
      });

      setProjects(response.data);

    } catch (error) {
      console.log(error);
    }
  }


  async function createProject() {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/projects",
        {
          Name: name,
          Description: description,
          User_id: 1
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setName("");
      setDescription("");

      fetchProjects();

    } catch (error) {
      console.log(error);
    }
  }


  function editProject(project) {
    setEditingId(project.Project_id);
    setName(project.Name);
    setDescription(project.Description);
  }


  async function updateProject() {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/projects/${editingId}`,
        {
          Name: name,
          Description: description,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      setEditingId(null);
      setName("");
      setDescription("");

      fetchProjects();

    } catch (error) {
      console.log(error);
    }
  }


  async function deleteProject(id) {
    try {
      const token = localStorage.getItem("token");

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this project?"
      );

      if (!confirmDelete) {
        return;
      }


      await api.delete(`/projects/${id}`, {
        headers: {
          authorization: token,
        },
      });


      fetchProjects();


    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div style={{ padding: "30px" }}>

      <h1>Dashboard</h1>


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


      {editingId ? (

        <button onClick={updateProject}>
          Update Project
        </button>

      ) : (

        <button onClick={createProject}>
          Create Project
        </button>

      )}



      <h2>Projects</h2>


      {projects.length === 0 ? (

        <p>No projects found.</p>

      ) : (

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

            {projects.map((project) => (

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

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Projects;