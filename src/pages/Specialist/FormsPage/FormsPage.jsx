import './FormsPage.css'
import Menu from '../../../components/Menu/Menu.jsx';
import FormsAmbiente from '../../../components/FormsAmbiente/FormsAmbiente.jsx';

function FormsPage(){
    return(
        <div className='geral'>
            <Menu/>
            <div className='main-wrapper'>
                <div className='forms-direita'>
                    <FormsAmbiente/>
                </div>
                
            </div>
        </div>
    )
}

export default FormsPage;