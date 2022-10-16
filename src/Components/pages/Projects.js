import { useLoaderData, useLocation } from "react-router-dom"
import styles from './Projects.module.css'
import Container from "../layout/Container"
import Loading from "../layout/Loading"
import LinkButton from "../layout/LinkButton"
import { useState, useEffect } from "react"

import Message from "../layout/Message"
import ProjectCard from "../project/ProjectCard"


function Projects() {

    const [projects, setProjects] = useState([])
    const [removerLoading, setRemoverLoading] = useState(false)
    const [projectMessage, setProjecMessage] = useState('')

    const location = useLocation()
    let message = ''
    if(location.state) {
        message = location.state.message
    }

    useEffect(() => {

        setTimeout(
            () => {
                fetch('http://localhost:5000/projects', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'aplication/json',
                    },
                })
                .then(resp => resp.json())
                .then(data => {
                    console.log(data)
                    setProjects(data)
                    setRemoverLoading(true)
                })
                .catch(err => console.log(err))
            }, 300)

    }, [])

    function removerProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        })
        .then(resp => resp.json())
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjecMessage('Projeto removido com sucesso!')
        })
        .catch(err => console.log(err))
    }


    return (
        <div className={styles.project_container}>
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <div className={styles.tittle_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newProject" text="Criar Projeto" />
            </div>
            <Container customClass="start">
                {projects.length > 0 &&
                projects.map((project) => (
                    <ProjectCard 
                    name={project.name}
                    key={project.id}
                    category={project.category ? project.category.name : 'Categoria Indefinida'}
                    budget={project.budget}
                    id={project.id}
                    handleRemove={removerProject}
                    />
                ))}
                {!removerLoading && <Loading />}
                {removerLoading && projects.lenght === 0 && (
                    <p>Não há projetos casdastrados!</p>
                )
                    
                }
            </Container>
        </div>
    )
}

export default Projects