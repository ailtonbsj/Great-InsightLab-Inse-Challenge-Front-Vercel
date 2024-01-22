/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { InseService } from '../service/InseService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { getLevel, locationNames, typeNetNames } from '../utils';
import { Chip } from 'primereact/chip';
import { Chart } from 'primereact/chart';

function Home() {
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    NU_ANO_SAEB: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    NO_UF: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ID_ESCOLA: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    NO_ESCOLA: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    NO_MUNICIPIO: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    TP_TIPO_REDE: { value: null, matchMode: FilterMatchMode.EQUALS },
    TP_LOCALIZACAO: { value: null, matchMode: FilterMatchMode.EQUALS },
    TP_CAPITAL: { value: null, matchMode: FilterMatchMode.EQUALS },
    QTD_ALUNOS_INSE: { value: null, matchMode: FilterMatchMode.LESS_THAN_OR_EQUAL_TO },
    MEDIA_INSE: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    INSE_CLASSIFICACAO: { value: null, matchMode: FilterMatchMode.EQUALS },
    PC_NIVEL_1: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_2: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_3: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_4: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_5: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_6: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_7: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    PC_NIVEL_8: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [typeNet] = useState(Object.values(typeNetNames));
  const [locations] = useState(Object.values(locationNames));
  const [levels] = useState(['Nível I', 'Nível II', 'Nível III', 'Nível IV', 'Nível V', 'Nível VI', 'Nível VII', 'Nível VIII']);

  const [amountSchools, setAmountSchools] = useState(0);
  const [sumOfStudents, setSumOfStudents] = useState(0);
  const [maxOfStudents, setMaxOfStudents] = useState(0);
  const [minOfStudents, setMinOfStudents] = useState(0);
  const [meanOfMean, setMeanOfMean] = useState('');
  const [inseLevels, setInseLevels] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    InseService.getSchoolsData().then((data) => {
      setSchools(getSchools(data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSchools = (data: any): any => {
    const schools = [...(data || [])];
    schools.map(d => {
      d['TP_TIPO_REDE'] = typeNetNames[d['TP_TIPO_REDE']];
      d['TP_LOCALIZACAO'] = locationNames[d['TP_LOCALIZACAO']];
      d['TP_CAPITAL'] = d['TP_CAPITAL'] === '1';
      d['QTD_ALUNOS_INSE'] = parseInt(d['QTD_ALUNOS_INSE']);
      d['MEDIA_INSE'] = parseFloat(d['MEDIA_INSE'].replace(',', '.'));
      d['PC_NIVEL_1'] = parseFloat(d['PC_NIVEL_1'].replace(',', '.'));
      d['PC_NIVEL_2'] = parseFloat(d['PC_NIVEL_2'].replace(',', '.'));
      d['PC_NIVEL_3'] = parseFloat(d['PC_NIVEL_3'].replace(',', '.'));
      d['PC_NIVEL_4'] = parseFloat(d['PC_NIVEL_4'].replace(',', '.'));
      d['PC_NIVEL_5'] = parseFloat(d['PC_NIVEL_5'].replace(',', '.'));
      d['PC_NIVEL_6'] = parseFloat(d['PC_NIVEL_6'].replace(',', '.'));
      d['PC_NIVEL_7'] = parseFloat(d['PC_NIVEL_7'].replace(',', '.'));
      d['PC_NIVEL_8'] = parseFloat(d['PC_NIVEL_8'].replace(',', '.'));
      return d;
    });
    aggregate(schools);
    return schools;
  }

  const getNetType = (status: string) => {
    switch (status) {
      case 'Federal':
        return 'warning';
      case 'Estadual':
        return 'info';
      case 'Municipal':
        return 'success';
    }
  };

  const getLocations = (status: string) => {
    switch (status) {
      case 'Urbana':
        return 'warning';
      case 'Rural':
        return 'danger';
    }
  };

  const netTypeBodyTemplate = (rowData: any) => {
    return <Tag value={rowData.TP_TIPO_REDE} severity={getNetType(rowData.TP_TIPO_REDE)} />;
  };

  const netTypeItemTemplate = (option: any) => {
    return <Tag value={option} severity={getNetType(option)} />;
  };

  const typeNetRowFilterTemplate = (options: any) => {
    return (
      <Dropdown value={options.value} options={typeNet} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={netTypeItemTemplate} placeholder="Rede" className="p-column-filter" showClear />
    );
  };

  const locationBodyTemplate = (rowData: any) => {
    return <Tag value={rowData.TP_LOCALIZACAO} severity={getLocations(rowData.TP_LOCALIZACAO)} />;
  };

  const locationItemTemplate = (option: any) => {
    return <Tag value={option} severity={getLocations(option)} />;
  };

  const locationRowFilterTemplate = (options: any) => {
    return (
      <Dropdown value={options.value} options={locations} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={locationItemTemplate} placeholder="Localidade" className="p-column-filter" showClear />
    );
  };

  const capitalBodyTemplate = (rowData: any) => {
    return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.TP_CAPITAL, 'false-icon pi-times-circle': !rowData.TP_CAPITAL })}></i>;
  };

  const capitalRowFilterTemplate = (options: any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
  };

  const levelBodyTemplate = (rowData: any) => {
    return <Tag value={rowData.INSE_CLASSIFICACAO} style={{ backgroundColor: getLevel(rowData.INSE_CLASSIFICACAO) }} />;
  };

  const levelRowFilterTemplate = (options: any) => {
    return (
      <Dropdown value={options.value} options={levels} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={levelItemTemplate} placeholder="Nível" className="p-column-filter" showClear />
    );
  };

  const levelItemTemplate = (option: any) => {
    return <Tag value={option} style={{ backgroundColor: getLevel(option) }} />;
  };

  const actionBodyTemplate = (row: any) => {
    return <Button severity='success' onClick={() => navigate(`/escola/${row.ID_ESCOLA}`)}>Detalhes</Button>;
  }

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters: any = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
        </span>
      </div>
    );
  };
  const header = renderHeader();

  const aggregate = (orderedOrFilteredArray: any) => {
    const countSchools = orderedOrFilteredArray.length;
    let sumStudents = 0;
    let maxStudents = 0;
    let minStudents = 10000;
    let sumMean = 0;
    let level1 = 0;
    let level2 = 0;
    let level3 = 0;
    let level4 = 0;
    let level5 = 0;
    let level6 = 0;
    let level7 = 0;
    let level8 = 0;
    orderedOrFilteredArray.map((school: any) => {
      sumStudents += school.QTD_ALUNOS_INSE;
      if (school.QTD_ALUNOS_INSE > maxStudents) maxStudents = school.QTD_ALUNOS_INSE;
      if (school.QTD_ALUNOS_INSE < minStudents) minStudents = school.QTD_ALUNOS_INSE;
      sumMean += school.MEDIA_INSE;
      level1 += school.PC_NIVEL_1;
      level2 += school.PC_NIVEL_2;
      level3 += school.PC_NIVEL_3;
      level4 += school.PC_NIVEL_4;
      level5 += school.PC_NIVEL_5;
      level6 += school.PC_NIVEL_6;
      level7 += school.PC_NIVEL_7;
      level8 += school.PC_NIVEL_8;
    });
    setAmountSchools(countSchools);
    setSumOfStudents(sumStudents);
    setMaxOfStudents(maxStudents);
    setMinOfStudents(minStudents);
    setMeanOfMean((sumMean / countSchools).toFixed(2));
    setInseLevels([level1 / countSchools, level2 / countSchools, level3 / countSchools, level4 / countSchools,
      level5 / countSchools, level6 / countSchools, level7 / countSchools, level8 / countSchools]);
  }

  const plotChart = () => {
    const data = {
      labels: ['Alunos Nível I', 'Alunos Nível II', 'Alunos Nível III', 'Alunos Nível IV',
        'Alunos Nível V', 'Alunos Nível VI', 'Alunos Nível VII', 'Alunos Nível VIII'],
      datasets: [
        {
          label: 'Percentual de alunos',
          data: inseLevels,
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
  }

  useEffect(() => {
    plotChart();
  }, [inseLevels]);

  return (
    <>
      <h1>Nível Socioeconômico (Inse)</h1>
      <DataTable value={schools} paginator rows={6} rowsPerPageOptions={[6, 10, 25, 50]} dataKey="ID_ESCOLA" filters={filters} filterDisplay="row"
        removableSort sortMode="multiple" globalFilterFields={['NO_UF', 'NO_MUNICIPIO', 'NO_ESCOLA', 'MEDIA_INSE']} header={header} emptyMessage="Nenhuma escola encontrada."
        onValueChange={aggregate}>
        <Column field="NU_ANO_SAEB" header="Ano Saeb" sortable filter filterPlaceholder="Buscar ano" style={{ minWidth: '12rem' }} />
        <Column field="NO_UF" header="Estado" sortable filter filterPlaceholder="Buscar Estado" style={{ minWidth: '14rem' }} />
        <Column field="NO_MUNICIPIO" header="Município" sortable filter filterPlaceholder="Buscar Município" style={{ minWidth: '17rem' }} />
        <Column field="ID_ESCOLA" header="Id Escola" sortable filter filterPlaceholder="Buscar Id da Escola" style={{ minWidth: '12rem' }} />
        <Column field="NO_ESCOLA" header="Escola" sortable filter filterPlaceholder="Buscar Escola" style={{ minWidth: '20rem' }} />
        <Column field="TP_TIPO_REDE" header="Tipo da rede" body={netTypeBodyTemplate} sortable filter showFilterMenu={false} filterElement={typeNetRowFilterTemplate} bodyStyle={{ textAlign: 'center' }} />
        <Column field="TP_LOCALIZACAO" header="Localidade" body={locationBodyTemplate} sortable filter showFilterMenu={false} filterElement={locationRowFilterTemplate} bodyStyle={{ textAlign: 'center' }} />
        <Column field="TP_CAPITAL" body={capitalBodyTemplate} header="Capital" dataType="boolean" sortable filter filterElement={capitalRowFilterTemplate} />
        <Column field="QTD_ALUNOS_INSE" header="Qt. Alunos" sortable filter filterPlaceholder="Buscar Quant. Alunos" style={{ minWidth: '12rem' }} />
        <Column field="MEDIA_INSE" header="Média" sortable filter filterPlaceholder="Buscar Médias" style={{ minWidth: '12rem' }} />
        <Column field="INSE_CLASSIFICACAO" header="Nível" body={levelBodyTemplate} sortable filter showFilterMenu={false} filterElement={levelRowFilterTemplate} bodyStyle={{ textAlign: 'center' }} />
        <Column field="PC_NIVEL_1" header="Nivel 1" body={v => v.PC_NIVEL_1 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_2" header="Nivel 2" body={v => v.PC_NIVEL_2 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_3" header="Nivel 3" body={v => v.PC_NIVEL_3 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_4" header="Nivel 4" body={v => v.PC_NIVEL_4 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_5" header="Nivel 5" body={v => v.PC_NIVEL_5 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_6" header="Nivel 6" body={v => v.PC_NIVEL_6 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_7" header="Nivel 7" body={v => v.PC_NIVEL_7 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column field="PC_NIVEL_8" header="Nivel 8" body={v => v.PC_NIVEL_8 + ' %'} sortable filter filterPlaceholder="Buscar percentual" style={{ minWidth: '11rem' }} />
        <Column body={actionBodyTemplate} />
      </DataTable>
      <div className='mt-2'>
        <strong className='mr-2'>Seleção Atual: </strong>
        <Chip className='mr-2' label={`Total de escolas: ${amountSchools}`} />
        <Chip className='mr-2' label={`Total de alunos: ${sumOfStudents}`} />
        <Chip className='mr-2' label={`Escola com mais alunos: ${maxOfStudents}`} />
        <Chip className='mr-2' label={`Escola com menos alunos: ${minOfStudents}`} />
        <Chip className='mr-2' label={`Média dos alunos: ${meanOfMean}`} />
      </div>
      <h2>Percentual de alunos da escola classificados por nível</h2>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </>
  )
}

export default Home
