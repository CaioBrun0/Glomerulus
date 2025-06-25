import Menu from "../../components/Menu/Menu"
import CardAmbiente from "../../components/cardAmbiente/cardAmbiente"
import "./Home.css"


function Home() {
    return(
        <>        
        <CardAmbiente type="Crescente" amount={512} />
        <Menu/>
        </>
    )
}

export default Home