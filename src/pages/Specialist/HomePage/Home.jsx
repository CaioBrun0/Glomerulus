import Menu from "../../../components/Menu/Menu.jsx"
import CardAmbiente from "../../../components/cardAmbiente/cardAmbiente.jsx"
import Imagem1 from "../../../assets/img-inovacao-medica.png"
import Imagem2 from "../../../assets/card1.png" 
import Imagem3 from "../../../assets/card2.png"
import Carrossel from "../../../components/Carrossel/Carrossel.jsx"
import ImagemFallback from "../../../assets/ambiente-indisponivel.png"
import "./Home.css"

function Home() {
    const imagensAvaliadas = 0;
    const ambiantesDisponiveis = 3;
    const dados = [
        {tipo: "Crescente", quantidade: 578},
        {tipo: "Membronosa", quantidade: 128},
        {tipo: "Titanica", quantidade: 225},
        {tipo: "Teste 2", quantidade: 225},
        {tipo: "Teste 3", quantidade: 225},
    ]
    return(
        <>        
        <div className="main-content">

            <Menu/>{/*Menu lateral */}

            {/*Parte de cima da página*/}
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
            
            <h2 style={{color: "black", marginLeft: "10px"}}>Ambientes</h2>

            {/*Parte de ambientes */}
           <div className="carrossel-ambientes">
            {dados.length === 0 ? (
                <div className="sem-conteudo">
                <img src={ImagemFallback} alt="Sem conteúdo" />
                </div>
            ) : (
                <Carrossel>
                {dados.map((item, index) => (
                    <CardAmbiente
                    key={index}
                    type={item.tipo}
                    amount={item.quantidade}
                    />
                ))}
                </Carrossel>
            )}
            </div>
            

        </div>
        </>
    )
}

export default Home