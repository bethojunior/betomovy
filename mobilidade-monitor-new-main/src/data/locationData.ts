export interface CountryItem {
  id: number;
  name: string;
  nome?: string;
  shortName: string;
}

export interface StateItem {
  id: number;
  country_id: number;
  countryId?: number;
  name: string;
  nome: string;
  sigla: string;
}

export interface CityItem {
  id: number;
  estate_id: number;
  estado?: number | string;
  name: string;
  nome: string;
  country: "BR" | "US" | string;
  polygon?: string;
}

// Lista completa de todos os países do mundo (Brasil e EUA no topo como prioridade)
export const ALL_COUNTRIES: CountryItem[] = [
  { id: 1, name: "Brasil", nome: "Brasil", shortName: "BR" },
  { id: 2, name: "Estados Unidos", nome: "Estados Unidos", shortName: "US" },
  { id: 3, name: "Afeganistão", nome: "Afeganistão", shortName: "AF" },
  { id: 4, name: "África do Sul", nome: "África do Sul", shortName: "ZA" },
  { id: 5, name: "Albânia", nome: "Albânia", shortName: "AL" },
  { id: 6, name: "Alemanha", nome: "Alemanha", shortName: "DE" },
  { id: 7, name: "Andorra", nome: "Andorra", shortName: "AD" },
  { id: 8, name: "Angola", nome: "Angola", shortName: "AO" },
  { id: 9, name: "Antígua e Barbuda", nome: "Antígua e Barbuda", shortName: "AG" },
  { id: 10, name: "Arábia Saudita", nome: "Arábia Saudita", shortName: "SA" },
  { id: 11, name: "Argélia", nome: "Argélia", shortName: "DZ" },
  { id: 12, name: "Argentina", nome: "Argentina", shortName: "AR" },
  { id: 13, name: "Armênia", nome: "Armênia", shortName: "AM" },
  { id: 14, name: "Austrália", nome: "Austrália", shortName: "AU" },
  { id: 15, name: "Áustria", nome: "Áustria", shortName: "AT" },
  { id: 16, name: "Azerbaijão", nome: "Azerbaijão", shortName: "AZ" },
  { id: 17, name: "Bahamas", nome: "Bahamas", shortName: "BS" },
  { id: 18, name: "Bangladesh", nome: "Bangladesh", shortName: "BD" },
  { id: 19, name: "Barbados", nome: "Barbados", shortName: "BB" },
  { id: 20, name: "Barein", nome: "Barein", shortName: "BH" },
  { id: 21, name: "Bélgica", nome: "Bélgica", shortName: "BE" },
  { id: 22, name: "Belize", nome: "Belize", shortName: "BZ" },
  { id: 23, name: "Benin", nome: "Benin", shortName: "BJ" },
  { id: 24, name: "Bielorrússia", nome: "Bielorrússia", shortName: "BY" },
  { id: 25, name: "Bolívia", nome: "Bolívia", shortName: "BO" },
  { id: 26, name: "Bósnia e Herzegovina", nome: "Bósnia e Herzegovina", shortName: "BA" },
  { id: 27, name: "Botsuana", nome: "Botsuana", shortName: "BW" },
  { id: 28, name: "Brunei", nome: "Brunei", shortName: "BN" },
  { id: 29, name: "Bulgária", nome: "Bulgária", shortName: "BG" },
  { id: 30, name: "Burkina Faso", nome: "Burkina Faso", shortName: "BF" },
  { id: 31, name: "Burundi", nome: "Burundi", shortName: "BI" },
  { id: 32, name: "Butão", nome: "Butão", shortName: "BT" },
  { id: 33, name: "Cabo Verde", nome: "Cabo Verde", shortName: "CV" },
  { id: 34, name: "Camarões", nome: "Camarões", shortName: "CM" },
  { id: 35, name: "Camboja", nome: "Camboja", shortName: "KH" },
  { id: 36, name: "Canadá", nome: "Canadá", shortName: "CA" },
  { id: 37, name: "Catar", nome: "Catar", shortName: "QA" },
  { id: 38, name: "Cazaquistão", nome: "Cazaquistão", shortName: "KZ" },
  { id: 39, name: "Chade", nome: "Chade", shortName: "TD" },
  { id: 40, name: "Chile", nome: "Chile", shortName: "CL" },
  { id: 41, name: "China", nome: "China", shortName: "CN" },
  { id: 42, name: "Chipre", nome: "Chipre", shortName: "CY" },
  { id: 43, name: "Colômbia", nome: "Colômbia", shortName: "CO" },
  { id: 44, name: "Comores", nome: "Comores", shortName: "KM" },
  { id: 45, name: "Congo", nome: "Congo", shortName: "CG" },
  { id: 46, name: "Coreia do Norte", nome: "Coreia do Norte", shortName: "KP" },
  { id: 47, name: "Coreia do Sul", nome: "Coreia do Sul", shortName: "KR" },
  { id: 48, name: "Costa do Marfim", nome: "Costa do Marfim", shortName: "CI" },
  { id: 49, name: "Costa Rica", nome: "Costa Rica", shortName: "CR" },
  { id: 50, name: "Croácia", nome: "Croácia", shortName: "HR" },
  { id: 51, name: "Cuba", nome: "Cuba", shortName: "CU" },
  { id: 52, name: "Dinamarca", nome: "Dinamarca", shortName: "DK" },
  { id: 53, name: "Djibuti", nome: "Djibuti", shortName: "DJ" },
  { id: 54, name: "Dominica", nome: "Dominica", shortName: "DM" },
  { id: 55, name: "Egito", nome: "Egito", shortName: "EG" },
  { id: 56, name: "El Salvador", nome: "El Salvador", shortName: "SV" },
  { id: 57, name: "Emirados Árabes Unidos", nome: "Emirados Árabes Unidos", shortName: "AE" },
  { id: 58, name: "Equador", nome: "Equador", shortName: "EC" },
  { id: 59, name: "Eritreia", nome: "Eritreia", shortName: "ER" },
  { id: 60, name: "Eslováquia", nome: "Eslováquia", shortName: "SK" },
  { id: 61, name: "Eslovênia", nome: "Eslovênia", shortName: "SI" },
  { id: 62, name: "Espanha", nome: "Espanha", shortName: "ES" },
  { id: 63, name: "Essuatíni", nome: "Essuatíni", shortName: "SZ" },
  { id: 64, name: "Estônia", nome: "Estônia", shortName: "EE" },
  { id: 65, name: "Etiópia", nome: "Etiópia", shortName: "ET" },
  { id: 66, name: "Fiji", nome: "Fiji", shortName: "FJ" },
  { id: 67, name: "Filipinas", nome: "Filipinas", shortName: "PH" },
  { id: 68, name: "Finlândia", nome: "Finlândia", shortName: "FI" },
  { id: 69, name: "França", nome: "França", shortName: "FR" },
  { id: 70, name: "Gabão", nome: "Gabão", shortName: "GA" },
  { id: 71, name: "Gâmbia", nome: "Gâmbia", shortName: "GM" },
  { id: 72, name: "Gana", nome: "Gana", shortName: "GH" },
  { id: 73, name: "Geórgia", nome: "Geórgia", shortName: "GE" },
  { id: 74, name: "Granada", nome: "Granada", shortName: "GD" },
  { id: 75, name: "Grécia", nome: "Grécia", shortName: "GR" },
  { id: 76, name: "Guatemala", nome: "Guatemala", shortName: "GT" },
  { id: 77, name: "Guiana", nome: "Guiana", shortName: "GY" },
  { id: 78, name: "Guiné", nome: "Guiné", shortName: "GN" },
  { id: 79, name: "Guiné Equatorial", nome: "Guiné Equatorial", shortName: "GQ" },
  { id: 80, name: "Guiné-Bissau", nome: "Guiné-Bissau", shortName: "GW" },
  { id: 81, name: "Haiti", nome: "Haiti", shortName: "HT" },
  { id: 82, name: "Holanda", nome: "Holanda (Países Baixos)", shortName: "NL" },
  { id: 83, name: "Honduras", nome: "Honduras", shortName: "HN" },
  { id: 84, name: "Hungria", nome: "Hungria", shortName: "HU" },
  { id: 85, name: "Iêmen", nome: "Iêmen", shortName: "YE" },
  { id: 86, name: "Ilhas Marshall", nome: "Ilhas Marshall", shortName: "MH" },
  { id: 87, name: "Ilhas Salomão", nome: "Ilhas Salomão", shortName: "SB" },
  { id: 88, name: "Índia", nome: "Índia", shortName: "IN" },
  { id: 89, name: "Indonésia", nome: "Indonésia", shortName: "ID" },
  { id: 90, name: "Irã", nome: "Irã", shortName: "IR" },
  { id: 91, name: "Iraque", nome: "Iraque", shortName: "IQ" },
  { id: 92, name: "Irlanda", nome: "Irlanda", shortName: "IE" },
  { id: 93, name: "Islândia", nome: "Islândia", shortName: "IS" },
  { id: 94, name: "Israel", nome: "Israel", shortName: "IL" },
  { id: 95, name: "Itália", nome: "Itália", shortName: "IT" },
  { id: 96, name: "Jamaica", nome: "Jamaica", shortName: "JM" },
  { id: 97, name: "Japão", nome: "Japão", shortName: "JP" },
  { id: 98, name: "Jordânia", nome: "Jordânia", shortName: "JO" },
  { id: 99, name: "Kuwait", nome: "Kuwait", shortName: "KW" },
  { id: 100, name: "Líbano", nome: "Líbano", shortName: "LB" },
  { id: 101, name: "Luxemburgo", nome: "Luxemburgo", shortName: "LU" },
  { id: 102, name: "México", nome: "México", shortName: "MX" },
  { id: 103, name: "Mônaco", nome: "Mônaco", shortName: "MC" },
  { id: 104, name: "Marrocos", nome: "Marrocos", shortName: "MA" },
  { id: 105, name: "Moçambique", nome: "Moçambique", shortName: "MZ" },
  { id: 106, name: "Nigéria", nome: "Nigéria", shortName: "NG" },
  { id: 107, name: "Noruega", nome: "Noruega", shortName: "NO" },
  { id: 108, name: "Nova Zelândia", nome: "Nova Zelândia", shortName: "NZ" },
  { id: 109, name: "Panamá", nome: "Panamá", shortName: "PA" },
  { id: 110, name: "Paraguai", nome: "Paraguai", shortName: "PY" },
  { id: 111, name: "Peru", nome: "Peru", shortName: "PE" },
  { id: 112, name: "Polônia", nome: "Polônia", shortName: "PL" },
  { id: 113, name: "Portugal", nome: "Portugal", shortName: "PT" },
  { id: 114, name: "Reino Unido", nome: "Reino Unido", shortName: "GB" },
  { id: 115, name: "Rússia", nome: "Rússia", shortName: "RU" },
  { id: 116, name: "Suécia", nome: "Suécia", shortName: "SE" },
  { id: 117, name: "Suíça", nome: "Suíça", shortName: "CH" },
  { id: 118, name: "Turquia", nome: "Turquia", shortName: "TR" },
  { id: 119, name: "Ucrânia", nome: "Ucrânia", shortName: "UA" },
  { id: 120, name: "Uruguai", nome: "Uruguai", shortName: "UY" },
  { id: 121, name: "Venezuela", nome: "Venezuela", shortName: "VE" },
];

// TODOS OS 27 ESTADOS DO BRASIL (id 1 a 27, country_id: 1)
export const BRAZIL_STATES: StateItem[] = [
  { id: 1, country_id: 1, countryId: 1, name: "Acre", nome: "Acre", sigla: "AC" },
  { id: 2, country_id: 1, countryId: 1, name: "Alagoas", nome: "Alagoas", sigla: "AL" },
  { id: 3, country_id: 1, countryId: 1, name: "Amapá", nome: "Amapá", sigla: "AP" },
  { id: 4, country_id: 1, countryId: 1, name: "Amazonas", nome: "Amazonas", sigla: "AM" },
  { id: 5, country_id: 1, countryId: 1, name: "Bahia", nome: "Bahia", sigla: "BA" },
  { id: 6, country_id: 1, countryId: 1, name: "Ceará", nome: "Ceará", sigla: "CE" },
  { id: 7, country_id: 1, countryId: 1, name: "Distrito Federal", nome: "Distrito Federal", sigla: "DF" },
  { id: 8, country_id: 1, countryId: 1, name: "Espírito Santo", nome: "Espírito Santo", sigla: "ES" },
  { id: 9, country_id: 1, countryId: 1, name: "Goiás", nome: "Goiás", sigla: "GO" },
  { id: 10, country_id: 1, countryId: 1, name: "Maranhão", nome: "Maranhão", sigla: "MA" },
  { id: 11, country_id: 1, countryId: 1, name: "Mato Grosso", nome: "Mato Grosso", sigla: "MT" },
  { id: 12, country_id: 1, countryId: 1, name: "Mato Grosso do Sul", nome: "Mato Grosso do Sul", sigla: "MS" },
  { id: 13, country_id: 1, countryId: 1, name: "Minas Gerais", nome: "Minas Gerais", sigla: "MG" },
  { id: 14, country_id: 1, countryId: 1, name: "Pará", nome: "Pará", sigla: "PA" },
  { id: 15, country_id: 1, countryId: 1, name: "Paraíba", nome: "Paraíba", sigla: "PB" },
  { id: 16, country_id: 1, countryId: 1, name: "Paraná", nome: "Paraná", sigla: "PR" },
  { id: 17, country_id: 1, countryId: 1, name: "Pernambuco", nome: "Pernambuco", sigla: "PE" },
  { id: 18, country_id: 1, countryId: 1, name: "Piauí", nome: "Piauí", sigla: "PI" },
  { id: 19, country_id: 1, countryId: 1, name: "Rio de Janeiro", nome: "Rio de Janeiro", sigla: "RJ" },
  { id: 20, country_id: 1, countryId: 1, name: "Rio Grande do Norte", nome: "Rio Grande do Norte", sigla: "RN" },
  { id: 21, country_id: 1, countryId: 1, name: "Rio Grande do Sul", nome: "Rio Grande do Sul", sigla: "RS" },
  { id: 22, country_id: 1, countryId: 1, name: "Rondônia", nome: "Rondônia", sigla: "RO" },
  { id: 23, country_id: 1, countryId: 1, name: "Roraima", nome: "Roraima", sigla: "RR" },
  { id: 24, country_id: 1, countryId: 1, name: "Santa Catarina", nome: "Santa Catarina", sigla: "SC" },
  { id: 25, country_id: 1, countryId: 1, name: "São Paulo", nome: "São Paulo", sigla: "SP" },
  { id: 26, country_id: 1, countryId: 1, name: "Sergipe", nome: "Sergipe", sigla: "SE" },
  { id: 27, country_id: 1, countryId: 1, name: "Tocantins", nome: "Tocantins", sigla: "TO" },
];

// TODOS OS 50 ESTADOS DOS ESTADOS UNIDOS + WASHINGTON D.C. (id 101 a 151, country_id: 2)
export const US_STATES: StateItem[] = [
  { id: 101, country_id: 2, countryId: 2, name: "Alabama", nome: "Alabama", sigla: "AL" },
  { id: 102, country_id: 2, countryId: 2, name: "Alaska", nome: "Alaska", sigla: "AK" },
  { id: 103, country_id: 2, countryId: 2, name: "Arizona", nome: "Arizona", sigla: "AZ" },
  { id: 104, country_id: 2, countryId: 2, name: "Arkansas", nome: "Arkansas", sigla: "AR" },
  { id: 105, country_id: 2, countryId: 2, name: "California", nome: "California", sigla: "CA" },
  { id: 106, country_id: 2, countryId: 2, name: "Colorado", nome: "Colorado", sigla: "CO" },
  { id: 107, country_id: 2, countryId: 2, name: "Connecticut", nome: "Connecticut", sigla: "CT" },
  { id: 108, country_id: 2, countryId: 2, name: "Delaware", nome: "Delaware", sigla: "DE" },
  { id: 109, country_id: 2, countryId: 2, name: "District of Columbia", nome: "District of Columbia (Washington D.C.)", sigla: "DC" },
  { id: 110, country_id: 2, countryId: 2, name: "Florida", nome: "Florida", sigla: "FL" },
  { id: 111, country_id: 2, countryId: 2, name: "Georgia", nome: "Georgia", sigla: "GA" },
  { id: 112, country_id: 2, countryId: 2, name: "Hawaii", nome: "Hawaii", sigla: "HI" },
  { id: 113, country_id: 2, countryId: 2, name: "Idaho", nome: "Idaho", sigla: "ID" },
  { id: 114, country_id: 2, countryId: 2, name: "Illinois", nome: "Illinois", sigla: "IL" },
  { id: 115, country_id: 2, countryId: 2, name: "Indiana", nome: "Indiana", sigla: "IN" },
  { id: 116, country_id: 2, countryId: 2, name: "Iowa", nome: "Iowa", sigla: "IA" },
  { id: 117, country_id: 2, countryId: 2, name: "Kansas", nome: "Kansas", sigla: "KS" },
  { id: 118, country_id: 2, countryId: 2, name: "Kentucky", nome: "Kentucky", sigla: "KY" },
  { id: 119, country_id: 2, countryId: 2, name: "Louisiana", nome: "Louisiana", sigla: "LA" },
  { id: 120, country_id: 2, countryId: 2, name: "Maine", nome: "Maine", sigla: "ME" },
  { id: 121, country_id: 2, countryId: 2, name: "Maryland", nome: "Maryland", sigla: "MD" },
  { id: 122, country_id: 2, countryId: 2, name: "Massachusetts", nome: "Massachusetts", sigla: "MA" },
  { id: 123, country_id: 2, countryId: 2, name: "Michigan", nome: "Michigan", sigla: "MI" },
  { id: 124, country_id: 2, countryId: 2, name: "Minnesota", nome: "Minnesota", sigla: "MN" },
  { id: 125, country_id: 2, countryId: 2, name: "Mississippi", nome: "Mississippi", sigla: "MS" },
  { id: 126, country_id: 2, countryId: 2, name: "Missouri", nome: "Missouri", sigla: "MO" },
  { id: 127, country_id: 2, countryId: 2, name: "Montana", nome: "Montana", sigla: "MT" },
  { id: 128, country_id: 2, countryId: 2, name: "Nebraska", nome: "Nebraska", sigla: "NE" },
  { id: 129, country_id: 2, countryId: 2, name: "Nevada", nome: "Nevada", sigla: "NV" },
  { id: 130, country_id: 2, countryId: 2, name: "New Hampshire", nome: "New Hampshire", sigla: "NH" },
  { id: 131, country_id: 2, countryId: 2, name: "New Jersey", nome: "New Jersey", sigla: "NJ" },
  { id: 132, country_id: 2, countryId: 2, name: "New Mexico", nome: "New Mexico", sigla: "NM" },
  { id: 133, country_id: 2, countryId: 2, name: "New York", nome: "New York", sigla: "NY" },
  { id: 134, country_id: 2, countryId: 2, name: "North Carolina", nome: "North Carolina", sigla: "NC" },
  { id: 135, country_id: 2, countryId: 2, name: "North Dakota", nome: "North Dakota", sigla: "ND" },
  { id: 136, country_id: 2, countryId: 2, name: "Ohio", nome: "Ohio", sigla: "OH" },
  { id: 137, country_id: 2, countryId: 2, name: "Oklahoma", nome: "Oklahoma", sigla: "OK" },
  { id: 138, country_id: 2, countryId: 2, name: "Oregon", nome: "Oregon", sigla: "OR" },
  { id: 139, country_id: 2, countryId: 2, name: "Pennsylvania", nome: "Pennsylvania", sigla: "PA" },
  { id: 140, country_id: 2, countryId: 2, name: "Rhode Island", nome: "Rhode Island", sigla: "RI" },
  { id: 141, country_id: 2, countryId: 2, name: "South Carolina", nome: "South Carolina", sigla: "SC" },
  { id: 142, country_id: 2, countryId: 2, name: "South Dakota", nome: "South Dakota", sigla: "SD" },
  { id: 143, country_id: 2, countryId: 2, name: "Tennessee", nome: "Tennessee", sigla: "TN" },
  { id: 144, country_id: 2, countryId: 2, name: "Texas", nome: "Texas", sigla: "TX" },
  { id: 145, country_id: 2, countryId: 2, name: "Utah", nome: "Utah", sigla: "UT" },
  { id: 146, country_id: 2, countryId: 2, name: "Vermont", nome: "Vermont", sigla: "VT" },
  { id: 147, country_id: 2, countryId: 2, name: "Virginia", nome: "Virginia", sigla: "VA" },
  { id: 148, country_id: 2, countryId: 2, name: "Washington", nome: "Washington", sigla: "WA" },
  { id: 149, country_id: 2, countryId: 2, name: "West Virginia", nome: "West Virginia", sigla: "WV" },
  { id: 150, country_id: 2, countryId: 2, name: "Wisconsin", nome: "Wisconsin", sigla: "WI" },
  { id: 151, country_id: 2, countryId: 2, name: "Wyoming", nome: "Wyoming", sigla: "WY" },
];

export const ALL_STATES: StateItem[] = [...BRAZIL_STATES, ...US_STATES];

// CIDADES POR ESTADO DO BRASIL E DOS ESTADOS UNIDOS
export const CITIES_BY_STATE: Record<number, string[]> = {
  // BRASIL:
  1: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia"], // AC
  2: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares", "Penedo"], // AL
  3: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande"], // AP
  4: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga"], // AM
  5: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Ilhéus", "Porto Seguro", "Lauro de Freitas", "Jequié", "Barreiras", "Alagoinhas"], // BA
  6: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá"], // CE
  7: ["Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Plano Piloto", "Águas Claras", "Gama", "Guará", "Santa Maria", "Sobradinho"], // DF
  8: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Cachoeiro de Itapemirim", "Linhares", "Colatina", "Guarapari", "São Mateus"], // ES
  9: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Itumbiara"], // GO
  10: ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas"], // MA
  11: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças"], // MT
  12: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Sidrolândia"], // MS
  13: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Poços de Caldas", "Pouso Alegre"], // MG
  14: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Bragança", "Altamira"], // PA
  15: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira", "Cabedelo"], // PB
  16: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Toledo", "Apucarana"], // PR
  17: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão"], // PE
  18: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Barras", "Campo Maior", "União"], // PI
  19: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "São João de Meriti", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda", "Macaé", "Magé", "Itaboraí", "Cabo Frio", "Angra dos Reis", "Nova Friburgo", "Barra Mansa", "Teresópolis", "Mesquita", "Nilópolis", "Maricá", "Rio das Ostras", "Resende"], // RJ
  20: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Ceará-Mirim", "Macaíba", "Caicó", "Açu"], // RN
  21: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Uruguaiana", "Santa Cruz do Sul"], // RS
  22: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Jaru", "Rolim de Moura", "Guajará-Mirim"], // RO
  23: ["Boa Vista", "Rorainópolis", "Caracaraí", "Cantá", "Mucajaí", "Pacaraima"], // RR
  24: ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Jaraguá do Sul", "Lages", "Palhoça", "Balneário Camboriú", "Brusque", "Tubarão"], // SC
  25: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "São José dos Campos", "Osasco", "Ribeirão Preto", "Sorocaba", "Mauá", "São José do Rio Preto", "Santos", "Mogi das Cruzes", "Diadema", "Jundiaí", "Piracicaba", "Carapicuíba", "Bauru", "Itaquaquecetuba", "São Vicente", "Franca", "Praia Grande", "Guarujá", "Taubaté", "Limeira", "Suzano", "Taboão da Serra", "Sumaré", "Barueri", "Embu das Artes", "Indaiatuba", "Cotia", "Americana", "Araraquara", "Jacareí", "Hortolândia", "Presidente Prudente", "São Carlos", "Marília"], // SP
  26: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto"], // SE
  27: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí"], // TO

  // ESTADOS UNIDOS:
  101: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Hoover", "Dothan", "Auburn"], // AL
  102: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla", "Kenai"], // AK
  103: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe", "Peoria", "Surprise", "Yuma", "Flagstaff"], // AZ
  104: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "Rogers", "Conway", "Bentonville"], // AR
  105: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim", "Santa Ana", "Riverside", "Stockton", "Irvine", "Chula Vista", "Fremont", "San Bernardino", "Modesto", "Fontana", "Oxnard", "Moreno Valley", "Huntington Beach", "Glendale", "Santa Clarita", "Garden Grove", "Oceanside", "Rancho Cucamonga", "Santa Rosa", "Ontario", "Lancaster"], // CA
  106: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Centennial", "Boulder", "Greeley"], // CO
  107: ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury", "Norwalk", "Danbury", "New Britain"], // CT
  108: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna", "Milford"], // DE
  109: ["Washington D.C."], // DC
  110: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", "Hialeah", "Port St. Lucie", "Cape Coral", "Tallahassee", "Fort Lauderdale", "Pembroke Pines", "Hollywood", "Gainesville", "Miramar", "Coral Springs", "Clearwater", "Miami Gardens", "Pompano Beach", "West Palm Beach", "Lakeland", "Boca Raton", "Delray Beach", "Daytona Beach", "Kissimmee", "Sarasota", "Fort Myers", "Naples"], // FL
  111: ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs", "Roswell", "Johns Creek", "Albany", "Warner Robins", "Alpharetta", "Marietta"], // GA
  112: ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu", "Kaneohe", "Kahului"], // HI
  113: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Caldwell", "Pocatello", "Coeur d'Alene", "Twin Falls"], // ID
  114: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield", "Elgin", "Peoria", "Champaign", "Waukegan", "Cicero", "Bloomington", "Arlington Heights", "Evanston"], // IL
  115: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers", "Bloomington", "Hammond", "Gary", "Lafayette", "Muncie"], // IN
  116: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Waterloo", "Ames", "West Des Moines", "Council Bluffs", "Dubuque"], // IA
  117: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence", "Shawnee", "Manhattan", "Lenexa", "Salina"], // KS
  118: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Richmond", "Georgetown", "Florence", "Hopkinsville"], // KY
  119: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe", "Alexandria"], // LA
  120: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn", "Biddeford", "Sanford", "Saco", "Augusta"], // ME
  121: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Hagerstown", "Annapolis", "College Park", "Salisbury"], // MD
  122: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell", "Brockton", "New Bedford", "Quincy", "Lynn", "Fall River", "Newton", "Lawrence", "Somerville"], // MA
  123: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint", "Dearborn", "Livonia", "Troy", "Westland", "Farmington Hills", "Kalamazoo"], // MI
  124: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park", "Plymouth", "Maple Grove", "Woodbury", "St. Cloud", "Eagan", "Eden Prairie"], // MN
  125: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Greenville", "Olive Branch", "Horn Lake"], // MS
  126: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence", "Lee's Summit", "O'Fallon", "St. Joseph", "St. Charles", "Blue Springs"], // MO
  127: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre"], // MT
  128: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "Norfolk", "North Platte", "Columbus"], // NE
  129: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City", "Fernley", "Elko", "Mesquite", "Boulder City"], // NV
  130: ["Manchester", "Nashua", "Concord", "Dover", "Rochester", "Keene", "Portsmouth", "Laconia"], // NH
  131: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge", "Lakewood", "Toms River", "Hamilton", "Trenton", "Clifton", "Camden", "Cherry Hill", "Passaic"], // NJ
  132: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs", "South Valley"], // NM
  133: ["New York", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica", "White Plains", "Hempstead", "Troy", "Niagara Falls", "Binghamton"], // NY
  134: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Concord", "Asheville", "Greenville", "Gastonia", "Apex"], // NC
  135: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Mandan"], // ND
  136: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain", "Hamilton", "Springfield", "Kettering", "Elyria", "Lakewood"], // OH
  137: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton", "Moore", "Midwest City", "Enid", "Stillwater"], // OK
  138: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton", "Bend", "Medford", "Springfield", "Corvallis", "Albany", "Tigard"], // OR
  139: ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie", "Upper Darby", "Scranton", "Bethlehem", "Lower Merion", "Lancaster", "Harrisburg", "Altoona", "York", "State College"], // PA
  140: ["Providence", "Cranston", "Warwick", "Pawtucket", "East Providence", "Woonsocket", "Coventry", "Cumberland"], // RI
  141: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville", "Summerville", "Sumter", "Goose Creek", "Hilton Head Island", "Florence", "Spartanburg"], // SC
  142: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Yankton", "Pierre"], // SD
  143: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Johnson City", "Jackson", "Hendersonville", "Bartlett", "Kingsport"], // TN
  144: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie", "Brownsville", "McKinney", "Frisco", "Pasadena", "Mesquite", "Killeen", "McAllen", "Carrollton", "Midland", "Waco", "Denton", "Abilene", "Odessa", "Beaumont", "Round Rock", "The Woodlands", "Richardson"], // TX
  145: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "South Jordan", "Lehi", "Millcreek", "Taylorsville", "Logan"], // UT
  146: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier", "Winooski", "St. Albans"], // VT
  147: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Roanoke", "Portsmouth", "Suffolk", "Lynchburg", "Charlottesville"], // VA
  148: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Spokane Valley", "Federal Way", "Yakima", "Bellingham", "Kirkland", "Kennewick", "Auburn", "Pasco", "Redmond", "Marysville", "Olympia"], // WA
  149: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Weirton", "Fairmont", "Martinsburg"], // WV
  150: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Oshkosh", "Eau Claire", "Janesville", "West Allis", "La Crosse", "Sheboygan", "Wauwatosa"], // WI
  151: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston", "Jackson"], // WY
};

/**
 * Retorna lista mesclada de países (prioriza dados da API e preenche faltantes com ALL_COUNTRIES)
 */
export function mergeCountries(apiCountries: any[] = []): CountryItem[] {
  const merged: CountryItem[] = [];
  const mapByNameOrId = new Map<string, CountryItem>();

  // Primeiro adiciona os países oficiais padrão
  for (const c of ALL_COUNTRIES) {
    const key = c.name.toLowerCase();
    mapByNameOrId.set(key, c);
    mapByNameOrId.set(String(c.id), c);
  }

  // Se a API retornou países adicionais ou com IDs específicos, respeita a API
  if (Array.isArray(apiCountries)) {
    for (const item of apiCountries) {
      if (!item) continue;
      const id = Number(item.id || item.country_id || 0);
      const name = item.name || item.nome || "";
      const shortName = item.shortName || item.sigla || "";
      if (name) {
        const existing = mapByNameOrId.get(name.toLowerCase());
        if (existing) {
          existing.id = id || existing.id;
          if (shortName) existing.shortName = shortName;
        } else {
          const newCountry: CountryItem = {
            id: id || mapByNameOrId.size + 1,
            name,
            nome: name,
            shortName: shortName || name.substring(0, 2).toUpperCase(),
          };
          mapByNameOrId.set(name.toLowerCase(), newCountry);
        }
      }
    }
  }

  // Constrói lista única ordenada (Brasil em 1º, Estados Unidos em 2º, depois ordem alfabética)
  const uniqueList = Array.from(new Set(mapByNameOrId.values()));
  const brazil = uniqueList.find(
    (c) => c.name.toLowerCase() === "brasil" || c.shortName === "BR"
  ) || ALL_COUNTRIES[0];
  const usa = uniqueList.find(
    (c) =>
      c.name.toLowerCase().includes("estados unidos") ||
      c.name.toLowerCase() === "usa" ||
      c.shortName === "US"
  ) || ALL_COUNTRIES[1];

  const others = uniqueList
    .filter(
      (c) =>
        c.id !== brazil.id &&
        c.id !== usa.id &&
        c.name.toLowerCase() !== "brasil" &&
        !c.name.toLowerCase().includes("estados unidos")
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return [brazil, usa, ...others];
}

/**
 * Retorna os estados de um país (Brasil = 27 estados, EUA = 51 estados)
 */
export function getStatesByCountry(
  countryIdOrName: number | string,
  apiStates: any[] = []
): StateItem[] {
  const isUS =
    String(countryIdOrName) === "2" ||
    String(countryIdOrName).toLowerCase() === "us" ||
    String(countryIdOrName).toLowerCase().includes("estados unidos");

  const defaultStates = isUS ? US_STATES : BRAZIL_STATES;

  if (!Array.isArray(apiStates) || apiStates.length === 0) {
    return defaultStates;
  }

  // Mescla com estados vindos da API
  const map = new Map<string, StateItem>();
  for (const st of defaultStates) {
    map.set(st.name.toLowerCase(), st);
    map.set(st.sigla.toLowerCase(), st);
  }

  for (const item of apiStates) {
    if (!item) continue;
    const name = item.name || item.nome || "";
    const sigla = item.sigla || "";
    const id = Number(item.id || 0);
    const key = name.toLowerCase();

    const existing = map.get(key) || map.get(sigla.toLowerCase());
    if (existing) {
      if (id) existing.id = id;
    } else if (name) {
      const newState: StateItem = {
        id: id || defaultStates.length + map.size + 1,
        country_id: isUS ? 2 : 1,
        countryId: isUS ? 2 : 1,
        name,
        nome: name,
        sigla: sigla || "--",
      };
      map.set(key, newState);
    }
  }

  return Array.from(new Set(map.values())).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
}

/**
 * Retorna as cidades de um estado
 */
export function getCitiesByStateId(
  stateId: number | string,
  stateName?: string,
  stateSigla?: string,
  apiCities: any[] = []
): CityItem[] {
  const sId = Number(stateId);
  const defaultCityNames: string[] = CITIES_BY_STATE[sId] || [];

  // Se não achou pelo ID exato, tenta achar pelo nome ou sigla do estado
  if (defaultCityNames.length === 0 && (stateName || stateSigla)) {
    const st = ALL_STATES.find(
      (s) =>
        (stateName && s.name.toLowerCase() === stateName.toLowerCase()) ||
        (stateSigla && s.sigla.toLowerCase() === stateSigla.toLowerCase())
    );
    if (st && CITIES_BY_STATE[st.id]) {
      defaultCityNames.push(...CITIES_BY_STATE[st.id]);
    }
  }

  const map = new Map<string, CityItem>();

  // Adiciona cidades padrão pré-cadastradas
  let cityIndex = 1;
  for (const name of defaultCityNames) {
    const key = name.toLowerCase();
    map.set(key, {
      id: sId * 1000 + cityIndex,
      estate_id: sId,
      estado: sId,
      name,
      nome: name,
      country: sId >= 100 ? "US" : "BR",
    });
    cityIndex++;
  }

  // Mescla com cidades vindas da API (se houver cidades com ID cadastrado no banco, prevalece)
  if (Array.isArray(apiCities)) {
    for (const item of apiCities) {
      if (!item) continue;
      const name = item.name || item.nome || "";
      if (!name) continue;
      const key = name.toLowerCase();
      const id = Number(item.id || item.cityId || 0);
      const polygon = item.polygon || "";

      const existing = map.get(key);
      if (existing) {
        if (id) existing.id = id;
        if (polygon) existing.polygon = polygon;
      } else {
        map.set(key, {
          id: id || sId * 1000 + cityIndex++,
          estate_id: sId,
          estado: sId,
          name,
          nome: name,
          country: item.country || (sId >= 100 ? "US" : "BR"),
          polygon,
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
}
