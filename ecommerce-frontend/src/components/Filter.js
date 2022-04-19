import React, { useState } from "react";
import FormControl from 'react-bootstrap/FormControl';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import moment from "moment";


export const Filter = ({ setLowerDate, setUpperDate }) => {

    const [lowerDateDisplay, setLowerDateDisplay] = useState("");
    const [upperDateDisplay, setUpperDateDisplay] = useState("");
    const [showRange, setShowRange] = useState(false);

    const ultimos30Dias = () => {
        // Ocultar barra de fechas
        setShowRange(false);

        // Setear fecha limite como el dia actual
        const fecha = moment()
        setUpperDate(fecha.format())

        // Obtener y setear fecha de hace 30 dias
        fecha.subtract(30, 'days');
        setLowerDate(fecha.format());
    }

    const mesActual = () => {
        // Ocultar barra de fechas
        setShowRange(false);
        
        // Setear fecha limite como el dia actual
        const fecha = moment()
        setUpperDate(fecha.format())

        // Setear la fecha al 1ro del mes actual
        fecha.startOf('month');
        setLowerDate(fecha.format())
    }

    const ultimoAnio = () => {
        // Ocultar barra de fechas
        setShowRange(false);

        // Setear fecha limite como el dia actual
        const fecha = moment()
        setUpperDate(fecha.format())

        // Setear la fecha al 1ro de Enero del año actual
        fecha.startOf('year')
        setLowerDate(fecha.format())
    };

    const rangoFechas = () => {
        let dateRegex = /([0-9]{4})(\/|-)(0[1-9]|1[0-2])\2([0-2][0-9]|3[0-1])/gm;

        if (lowerDateDisplay.match(dateRegex) && upperDateDisplay.match(dateRegex)) {
            setLowerDate(moment(lowerDateDisplay).format());
            setUpperDate(moment(upperDateDisplay).format());
        }
    }


    return (
        <>
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 + 'px' }}>
                    <ButtonGroup className="me-2" size="sm">
                        <Button variant="outline-secondary" className="btn-radius" onClick={e => { setLowerDate("0"); setUpperDate("0"); setShowRange(false); }}>
                            Todos
                        </Button>
                        <Button variant="outline-secondary" className="btn-radius" onClick={e => ultimos30Dias()}>
                            Ultimos 30 dias
                        </Button>
                        <Button variant="outline-secondary" className="btn-radius" onClick={e => mesActual()}>
                            Mes actual
                        </Button>
                        <Button variant="outline-secondary" className="btn-radius" onClick={e => ultimoAnio()}>
                            Ultimo año
                        </Button>
                        <Button variant="outline-secondary" className="btn-radius" onClick={e => setShowRange(true)}>
                            Rango de fechas
                        </Button>
                    </ButtonGroup>
                </div>

                {
                    showRange ?
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Inicio</InputGroup.Text>
                            <FormControl aria-label="Inicio" value={lowerDateDisplay} onChange={e => setLowerDateDisplay(e.target.value)} />
                            <InputGroup.Text>Fin</InputGroup.Text>
                            <FormControl aria-label="Fin" value={upperDateDisplay} onChange={e => setUpperDateDisplay(e.target.value)} />

                            <Button onClick={e => rangoFechas()}>
                                Aplicar
                            </Button>
                        </InputGroup> :
                        null
                }



            </div>
        </>
    );
}