import './FormsPage.css'
import Menu from '../../../components/Menu/Menu.jsx';
import FormsAmbiente from '../../../components/FormsAmbiente/FormsAmbiente.jsx';

function FormsPage(){
    return(
        <div className='geral'>
            <Menu/>
            <div className='main-wrapper'>
                <div className='space-for-images'> 
                    <h2 className='images-title'>Título do ambiente</h2>

                    <div className='images-area'>
                        <p>Aqui ficarão as imagens do ambiente</p>
                    </div>

                    {/* placeholder para paginação futura */}
                    <div className='images-pagination'>
                        <button className='page-btn' disabled>{'‹'}</button>
                        <span className='page-info'>1 / 5</span>
                        <button className='page-btn'>{'›'}</button>
                    </div>
                </div>

                <div className='forms-direita'>
                    <FormsAmbiente/>
                </div>
            </div>
        </div>
    )
}

export default FormsPage;
