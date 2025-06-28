import Menu from "../../components/Menu/Menu"
import CardAmbiente from "../../components/cardAmbiente/cardAmbiente"
import Imagem1 from "../../assets/img-inovacao-medica.jpg"
import Imagem2 from "../../assets/card1.png"
import Imagem3 from "../../assets/card2.png"
import "./Home.css"


function Home() {
    const imagensAvaliadas = 0;
    const ambiantesDisponiveis = 3;
    return(
        <>        
        <div className="main-content">
            <Menu/>
            <div className="topo">
                <img src={Imagem1} alt="inovacaoMedica" className="img-inovacao"/>

                <div alt="avaliadas" className="cardTopo">
                    <img src={Imagem2} alt="card1" />
                    <p id="titulo"><span className="numero">{imagensAvaliadas}</span> Imagens Avaliadas</p>
                    <p>Para cada ambiente concluido, você contribui para o avanço da ciência</p>
                </div>

                <div alt="ambientes" className="cardTopo">
                    <img src={Imagem3} alt="card2" />
                    <p id="titulo"><span className="numero">{ambiantesDisponiveis}</span> Ambientes disponíveis</p>
                    <p>Não deixe para amanhã o que você pode fazer hoje</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home