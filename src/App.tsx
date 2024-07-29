import styles from'./app.module.css'
import Form from './components/form/Form'

function App() {


  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>

      <div className={styles.container}>
             <Form/>
            <p>2</p>
      </div>
    </>

  )
}

export default App
