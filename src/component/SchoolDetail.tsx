/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InseService } from "../service/InseService";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import './SchoolDetail.css';
import { getLevel, locationNames, typeNetNames } from '../utils';
import { SchoolRawData } from '../domain/SchoolRawData';

function SchoolDetail() {
    const [school, setSchool] = useState({} as SchoolRawData);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { schoolId } = useParams();
    const navigate = useNavigate();

    const getSchool = (data: any): any => {
        if (!data) return {};
        data['TP_TIPO_REDE'] = typeNetNames[data['TP_TIPO_REDE']];
        data['TP_LOCALIZACAO'] = locationNames[data['TP_LOCALIZACAO']];
        data['TP_CAPITAL'] = data['TP_CAPITAL'] === '1';
        data['QTD_ALUNOS_INSE'] = parseInt(data['QTD_ALUNOS_INSE']);
        data['MEDIA_INSE'] = parseFloat(data['MEDIA_INSE'].replace(',', '.'));
        data['PC_NIVEL_1'] = parseFloat(data['PC_NIVEL_1'].replace(',', '.'));
        data['PC_NIVEL_2'] = parseFloat(data['PC_NIVEL_2'].replace(',', '.'));
        data['PC_NIVEL_3'] = parseFloat(data['PC_NIVEL_3'].replace(',', '.'));
        data['PC_NIVEL_4'] = parseFloat(data['PC_NIVEL_4'].replace(',', '.'));
        data['PC_NIVEL_5'] = parseFloat(data['PC_NIVEL_5'].replace(',', '.'));
        data['PC_NIVEL_6'] = parseFloat(data['PC_NIVEL_6'].replace(',', '.'));
        data['PC_NIVEL_7'] = parseFloat(data['PC_NIVEL_7'].replace(',', '.'));
        data['PC_NIVEL_8'] = parseFloat(data['PC_NIVEL_8'].replace(',', '.'));
        return data;
    }

    useEffect(() => {
        if (schoolId) {
            InseService.getSchoolData(schoolId).then((data: object) => {
                setSchool(getSchool(data));
            });
        }
        console.log('LOAD QUERY PARAM');
    }, [schoolId]);

    useEffect(() => {
        const data = {
            labels: ['Alunos Nível I', 'Alunos Nível II', 'Alunos Nível III', 'Alunos Nível IV',
                'Alunos Nível V', 'Alunos Nível VI', 'Alunos Nível VII', 'Alunos Nível VIII'],
            datasets: [
                {
                    label: 'Percentual de alunos',
                    data: [school.PC_NIVEL_1, school.PC_NIVEL_2, school.PC_NIVEL_3, school.PC_NIVEL_4,
                    school.PC_NIVEL_5, school.PC_NIVEL_6, school.PC_NIVEL_7, school.PC_NIVEL_8],
                    backgroundColor: [getLevel('Nível I'), getLevel('Nível II'), getLevel('Nível III'), getLevel('Nível IV'),
                    getLevel('Nível V'), getLevel('Nível VI'), getLevel('Nível VII'), getLevel('Nível VIII')],
                    borderColor: [getLevel('Nível I'), getLevel('Nível II'), getLevel('Nível III'), getLevel('Nível IV'),
                    getLevel('Nível V'), getLevel('Nível VI'), getLevel('Nível VII'), getLevel('Nível VIII')],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            aspectRatio: 4,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [school]);

    return (
        <>
            <div className="card">
                <div className="flex flex-wrap justify-content-between align-items-start">
                    <h1>Detalhe da escola</h1>
                    <Button onClick={() => navigate('/')}>Clique para Voltar</Button>
                </div>
                <div id="items" className="flex flex-wrap">
                    <p><strong>Nome da Escola no CENSO Escolar: </strong>{school.NO_ESCOLA}</p>
                    <p><strong>Código da Escola no CENSO Escolar: </strong>{school.ID_ESCOLA}</p>

                    <p><strong>Nome da Unidade da Federação: </strong>{school.NO_UF}</p>
                    <p><strong>Sigla da Unidade da Federação: </strong>{school.SG_UF}</p>
                    <p><strong>Código da Unidade da Federação: </strong>{school.CO_UF}</p>

                    <p><strong>Nome do Município: </strong>{school.NO_MUNICIPIO}</p>
                    <p><strong>Código do Munípio: </strong>{school.CO_MUNICIPIO}</p>

                    <p><strong>Dependência Administrativa da Escola: </strong>{school.TP_TIPO_REDE}</p>
                    <p><strong>Localização da Escola: </strong>{school.TP_LOCALIZACAO}</p>
                    <p><strong>Área da Escola: </strong>{school.TP_CAPITAL}</p>

                    <p><strong>Quantidade de Alunos: </strong>{school.QTD_ALUNOS_INSE}</p>
                    <p><strong>Média do Indicador de Nível Socioeconômico: </strong>{school.MEDIA_INSE}</p>
                    <p><strong>Classificação do Indicador de Nível Socioeconômico: </strong>{school.INSE_CLASSIFICACAO}</p>

                    <p><strong>Ano de aplicação do Saeb: </strong>{school.NU_ANO_SAEB}</p>
                </div>

                <h2>Percentual de alunos da escola classificados por nível</h2>
                <Chart type="bar" data={chartData} options={chartOptions} />
            </div>
        </>
    )
}
export default SchoolDetail