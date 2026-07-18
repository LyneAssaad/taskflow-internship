import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {

  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {

    fetchProjects();

  }, []);




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


    if (name.trim() === "") {

      alert("Project name is required.");

      return;

    }


    if (description.trim() === "") {

      alert("Project description is required.");

      return;

    }



    try {


      await api.post(

        "/projects",

        {
          Name: name,
          Description: description,
          User_id: 1
        }

      );



      setName("");

      setDescription("");

      fetchProjects();



    } catch (error) {


      console.log(error);

      setError("Failed to create project.");


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



      setEditingId(null);

      setName("");

      setDescription("");

      fetchProjects();



    } catch (error) {


      console.log(error);

      setError("Failed to update project.");


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



      fetchProjects();



    } catch (error) {


      console.log(error);

      setError("Failed to delete project.");


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


                    <td>

                      {project.Project_id}

                    </td>


                    <td>

                      {project.Name}

                    </td>



                    <td>

                      {project.Description}

                    </td>




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