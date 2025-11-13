// Comprehensive provider availability mapping by ZIP code
// This maps ZIP codes to available electricity providers

// Provider information with service areas
export const PROVIDERS = {
  "TXU Energy": {
    name: "TXU Energy",
    states: ["TX"],
    logo: "https://www.txu.com/-/media/txu/images/logos/txu-logo.svg",
    website: "https://www.txu.com",
    zipCodes: [
      // Houston area
      "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77009", "77010",
      "77011", "77012", "77013", "77014", "77015", "77016", "77017", "77018", "77019",
      "77020", "77021", "77022", "77023", "77024", "77025", "77026", "77027", "77028",
      "77029", "77030", "77031", "77032", "77033", "77034", "77035", "77036", "77037",
      "77038", "77039", "77040", "77041", "77042", "77043", "77044", "77045", "77046",
      "77047", "77048", "77049", "77050", "77051", "77053", "77054", "77055", "77056",
      "77057", "77058", "77059", "77060", "77061", "77062", "77063", "77064", "77065",
      "77066", "77067", "77068", "77069", "77070", "77071", "77072", "77073", "77074",
      "77075", "77076", "77077", "77078", "77079", "77080", "77081", "77082", "77083",
      "77084", "77085", "77086", "77087", "77088", "77089", "77090", "77091", "77092",
      "77093", "77094", "77095", "77096", "77098", "77099",
      // Dallas area
      "75201", "75202", "75203", "75204", "75205", "75206", "75207", "75208", "75209",
      "75210", "75211", "75212", "75214", "75215", "75216", "75217", "75218", "75219",
      "75220", "75221", "75222", "75223", "75224", "75225", "75226", "75227", "75228",
      "75229", "75230", "75231", "75232", "75233", "75234", "75235", "75236", "75237",
      "75238", "75240", "75241", "75242", "75243", "75244", "75246", "75247", "75248",
      "75249", "75251", "75252", "75253", "75254",
      // Austin area
      "78701", "78702", "78703", "78704", "78705", "78712", "78717", "78719", "78721",
      "78722", "78723", "78724", "78725", "78726", "78727", "78728", "78729", "78730",
      "78731", "78732", "78733", "78734", "78735", "78736", "78737", "78738", "78739",
      "78741", "78742", "78744", "78745", "78746", "78747", "78748", "78749", "78750",
      "78751", "78752", "78753", "78754", "78756", "78757", "78758", "78759"
    ]
  },
  "Reliant Energy": {
    name: "Reliant Energy",
    states: ["TX"],
    logo: "https://www.reliant.com/content/dam/reliant/images/logo/reliant-logo.svg",
    website: "https://www.reliant.com",
    zipCodes: [
      // Houston area (full coverage)
      "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77009", "77010",
      "77011", "77012", "77013", "77014", "77015", "77016", "77017", "77018", "77019",
      "77020", "77021", "77022", "77023", "77024", "77025", "77026", "77027", "77028",
      "77029", "77030", "77031", "77032", "77033", "77034", "77035", "77036", "77037",
      "77038", "77039", "77040", "77041", "77042", "77043", "77044", "77045", "77046",
      "77047", "77048", "77049", "77050", "77051", "77053", "77054", "77055", "77056",
      "77057", "77058", "77059", "77060", "77061", "77062", "77063", "77064", "77065",
      "77066", "77067", "77068", "77069", "77070", "77071", "77072", "77073", "77074",
      "77075", "77076", "77077", "77078", "77079", "77080", "77081", "77082", "77083",
      "77084", "77085", "77086", "77087", "77088", "77089", "77090", "77091", "77092",
      "77093", "77094", "77095", "77096", "77098", "77099",
      // Dallas area
      "75201", "75202", "75203", "75204", "75205", "75206", "75207", "75208", "75209",
      "75210", "75211", "75212", "75214", "75215", "75216", "75217", "75218", "75219",
      "75220", "75221", "75222", "75223", "75224", "75225", "75226", "75227", "75228",
      "75229", "75230", "75231", "75232", "75233", "75234", "75235", "75236", "75237",
      "75238", "75240", "75241", "75242", "75243", "75244", "75246", "75247", "75248"
    ]
  },
  "Gexa Energy": {
    name: "Gexa Energy",
    states: ["TX"],
    logo: "https://www.gexaenergy.com/wp-content/uploads/2021/01/gexa-energy-logo.svg",
    website: "https://www.gexaenergy.com",
    zipCodes: [
      // Houston area
      "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77019",
      "77024", "77027", "77056", "77063", "77098",
      "77042", "77043", "77055", "77057", "77077", "77079", "77080", "77081",
      // Dallas area  
      "75201", "75202", "75204", "75205", "75206", "75214", "75219", "75225",
      "75230", "75231", "75240", "75243", "75248",
      // Fort Worth
      "76102", "76104", "76107", "76109", "76116", "76132"
    ]
  },
  "Direct Energy": {
    name: "Direct Energy",
    states: ["TX", "PA", "NY", "OH", "IL", "NJ", "MD"],
    logo: "https://www.directenergy.com/sites/retail/themes/custom/de_theme/logo.svg",
    website: "https://www.directenergy.com",
    zipCodes: [
      // Texas - Houston
      "77002", "77019", "77024", "77027", "77056", "77063",
      // Texas - Dallas
      "75201", "75204", "75205", "75219", "75225", "75230",
      // Pennsylvania - Philadelphia
      "19102", "19103", "19104", "19106", "19107", "19130", "19146",
      // Pennsylvania - Pittsburgh
      "15201", "15203", "15206", "15210", "15213", "15232",
      // New York - NYC
      "10001", "10002", "10003", "10009", "10010", "10011", "10012", "10013", "10014",
      // Ohio - Cleveland
      "44101", "44102", "44103", "44105", "44106", "44113", "44114", "44115",
      // Ohio - Columbus
      "43201", "43202", "43203", "43204", "43205", "43206", "43215",
      // Illinois - Chicago
      "60601", "60602", "60603", "60604", "60605", "60606", "60607", "60610"
    ]
  },
  "Frontier Utilities": {
    name: "Frontier Utilities",
    states: ["TX"],
    logo: "https://www.frontierutilities.com/wp-content/uploads/2020/01/frontier-logo.png",
    website: "https://www.frontierutilities.com",
    zipCodes: [
      // Houston area
      "77002", "77003", "77004", "77005", "77006", "77019", "77024", "77027",
      "77056", "77063", "77098", "77042", "77043", "77055",
      // Dallas area
      "75201", "75202", "75204", "75205", "75206", "75214", "75219", "75225",
      // San Antonio
      "78201", "78202", "78203", "78204", "78209", "78212", "78216", "78232"
    ]
  },
  "Green Mountain Energy": {
    name: "Green Mountain Energy",
    states: ["TX", "PA", "NJ"],
    logo: "https://www.greenmountainenergy.com/wp-content/themes/gme/images/logo.svg",
    website: "https://www.greenmountainenergy.com",
    zipCodes: [
      // Texas - Houston
      "77002", "77019", "77024", "77027", "77056", "77063", "77098",
      // Texas - Dallas
      "75201", "75204", "75205", "75219", "75225", "75230",
      // Texas - Austin
      "78701", "78702", "78703", "78704", "78731", "78745",
      // Pennsylvania
      "19102", "19103", "19104",
      // New Jersey
      "07001", "07002", "07003"
    ]
  },
  "Pulse Power": {
    name: "Pulse Power",
    states: ["TX"],
    logo: "https://www.pulsepower.com/wp-content/uploads/2021/01/pulse-power-logo.svg",
    website: "https://www.pulsepower.com",
    zipCodes: [
      // Houston
      "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77019",
      "77024", "77027", "77056", "77063", "77098",
      // Dallas
      "75201", "75202", "75204", "75205", "75206", "75214", "75219", "75225"
    ]
  },
  "Champion Energy": {
    name: "Champion Energy",
    states: ["TX", "PA"],
    logo: "https://championenergyservices.com/wp-content/uploads/2020/07/champion-energy-logo.svg",
    website: "https://www.championenergyservices.com",
    zipCodes: [
      // Texas - Houston
      "77002", "77019", "77024", "77027", "77056", "77063",
      // Texas - Dallas
      "75201", "75204", "75205", "75219", "75225",
      // Pennsylvania
      "19102", "19103", "19104", "15201", "15203"
    ]
  },
  "Constellation": {
    name: "Constellation",
    states: ["TX", "PA", "NY", "OH", "IL", "NJ", "MD", "MA", "ME", "NH", "RI", "CT"],
    logo: "https://www.constellation.com/content/dam/constellationenergy/images/logo/constellation-logo.svg",
    website: "https://www.constellation.com",
    zipCodes: [
      // Multi-state coverage - major cities only shown
      // Texas
      "77002", "77019", "75201", "75204", "78701", "78702",
      // Pennsylvania
      "19102", "19103", "15201", "15203",
      // New York
      "10001", "10002", "10003", "10009",
      // Ohio
      "44101", "44102", "43201", "43202",
      // Illinois
      "60601", "60602", "60603", "60604",
      // New Jersey
      "07001", "07002", "07003",
      // Maryland
      "21201", "21202", "21218",
      // Massachusetts
      "02101", "02108", "02109",
      // Maine
      "04101", "04102",
      // New Hampshire
      "03101", "03102",
      // Rhode Island
      "02901", "02903",
      // Connecticut
      "06101", "06103"
    ]
  },
  "4Change Energy": {
    name: "4Change Energy",
    states: ["TX"],
    logo: "https://www.4changeenergy.com/wp-content/themes/4change/images/logo.svg",
    website: "https://www.4changeenergy.com",
    zipCodes: [
      // Houston
      "77002", "77003", "77004", "77019", "77024", "77027", "77056",
      // Dallas
      "75201", "75202", "75204", "75205", "75219"
    ]
  }
};

// Function to get providers available for a specific ZIP code
export const getProvidersForZipCode = (zipCode) => {
  if (!zipCode || zipCode.length !== 5) return [];
  
  const availableProviders = [];
  
  Object.values(PROVIDERS).forEach(provider => {
    if (provider.zipCodes.includes(zipCode)) {
      availableProviders.push(provider);
    }
  });
  
  return availableProviders;
};

// Function to check if a provider serves a specific ZIP code
export const providerServesZip = (providerName, zipCode) => {
  const provider = PROVIDERS[providerName];
  if (!provider) return false;
  return provider.zipCodes.includes(zipCode);
};

// Function to get provider details
export const getProviderDetails = (providerName) => {
  return PROVIDERS[providerName] || null;
};

// Function to get all available provider names for a ZIP
export const getProviderNamesForZip = (zipCode) => {
  return getProvidersForZipCode(zipCode).map(p => p.name);
};

// ZIP code to city mapping
export const ZIP_TO_CITY = {
  // Houston area
  "77002": "Houston", "77003": "Houston", "77004": "Houston", "77005": "Houston",
  "77006": "Houston", "77007": "Houston", "77008": "Houston", "77009": "Houston",
  "77019": "Houston", "77024": "Houston", "77027": "Houston", "77056": "Houston",
  "77063": "Houston", "77098": "Houston", "77042": "Houston", "77043": "Houston",
  
  // Dallas area
  "75201": "Dallas", "75202": "Dallas", "75204": "Dallas", "75205": "Dallas",
  "75206": "Dallas", "75214": "Dallas", "75219": "Dallas", "75225": "Dallas",
  "75230": "Dallas", "75231": "Dallas", "75240": "Dallas", "75243": "Dallas",
  
  // Austin area
  "78701": "Austin", "78702": "Austin", "78703": "Austin", "78704": "Austin",
  "78731": "Austin", "78745": "Austin", "78757": "Austin",
  
  // Fort Worth
  "76102": "Fort Worth", "76104": "Fort Worth", "76107": "Fort Worth",
  
  // San Antonio
  "78201": "San Antonio", "78202": "San Antonio", "78209": "San Antonio",
  
  // Pennsylvania - Philadelphia
  "19102": "Philadelphia", "19103": "Philadelphia", "19104": "Philadelphia",
  
  // Pennsylvania - Pittsburgh
  "15201": "Pittsburgh", "15203": "Pittsburgh", "15206": "Pittsburgh",
  
  // New York - NYC
  "10001": "New York", "10002": "New York", "10003": "New York",
  
  // Ohio - Cleveland
  "44101": "Cleveland", "44102": "Cleveland", "44103": "Cleveland",
  
  // Ohio - Columbus
  "43201": "Columbus", "43202": "Columbus", "43203": "Columbus",
  
  // Illinois - Chicago
  "60601": "Chicago", "60602": "Chicago", "60603": "Chicago",
  
  // New Jersey
  "07001": "Newark", "07002": "Newark", "07003": "Newark",
  
  // Maryland - Baltimore
  "21201": "Baltimore", "21202": "Baltimore", "21218": "Baltimore",
  
  // Massachusetts - Boston
  "02101": "Boston", "02108": "Boston", "02109": "Boston",
  
  // Maine - Portland
  "04101": "Portland", "04102": "Portland",
  
  // New Hampshire - Manchester
  "03101": "Manchester", "03102": "Manchester",
  
  // Rhode Island - Providence
  "02901": "Providence", "02903": "Providence",
  
  // Connecticut - Hartford
  "06101": "Hartford", "06103": "Hartford"
};

// Get city name from ZIP code
export const getCityFromZip = (zipCode) => {
  return ZIP_TO_CITY[zipCode] || "Unknown";
};