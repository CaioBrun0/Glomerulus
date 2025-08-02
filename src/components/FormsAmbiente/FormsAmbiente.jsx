import './FormsAmbiente.css'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function FormsAmbiente(titlle, option1, option2, option3, option4){
    return(
        <div className='forms-base'>
            <h2>Defina o tipo de lesão glomerular primária: </h2>
            <div className='forms-control'>
                <FormGroup sx={{
                    '& .MuiFormControlLabel-root': {
                    marginBottom: '0.8rem', // espaçamento entre os checkboxes
                    marginTop: '0.8rem', // espaçamento entre os checkboxes
                    },
                    '& .MuiFormControlLabel-label': {
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '1.15rem'
                    },
                    '& .MuiSvgIcon-root': {
                    fontSize: 28
                    }
                }}
                >
                    <FormControlLabel control={<Checkbox />} label="Glomerulonefrite rapidamente progressiva (GNRP)" />
                    <FormControlLabel control={<Checkbox />} label="Glomerulonefrite crescentica associada a doenças autoimunes" />
                    <FormControlLabel control={<Checkbox />} label="Glomerulonefrite crescentica pauci-imune" />
                    <FormControlLabel control={<Checkbox />} label="Glomerulonefrite crescentica secundária a infecções" />
                </FormGroup>
            </div>
            
            <button type='submit'>Submeter</button>

        </div>
    )
}

export default FormsAmbiente;