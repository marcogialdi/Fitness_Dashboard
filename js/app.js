// CONFIGURAZIONE SUPABASE
const SUPABASE_URL = "https://onrwqsbzakekauejmjer.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ucndxc2J6YWtla2F1ZWptamVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTE0MjEsImV4cCI6MjEwNjc4NzQyMX0.1mpLds2hTvuaFat18GN7KrtDAOcAb3r6H2TmsA9i8H0";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Toggle Menu Mobile Hamburger
function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('open');
}

// Mappatura Mesi IT -> EN per le date Hevy
const mesiIT = { 'gen': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'apr': 'Apr', 'mag': 'May', 'giu': 'Jun', 'lug': 'Jul', 'ago': 'Aug', 'set': 'Sep', 'ott': 'Oct', 'nov': 'Nov', 'dic': 'Dec' };

function parseHevyDate(dateStr) {
    if (!dateStr) return null;
    let s = String(dateStr);
    Object.keys(mesiIT).forEach(it => { s = s.replace(it, mesiIT[it]); });
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.toISOString();
}

// Estrattore dell'ultimo dato valido non nullo per la BIA
function getLastValidMetric(records, field) {
    if (!records || !records.length) return { val: '-', date: '' };
    for (let i = records.length - 1; i >= 0; i--) {
        if (records[i][field] !== null && records[i][field] !== undefined) {
            const dateStr = records[i].measurement_time ? records[i].measurement_time.split('T')[0] : '';
            return { val: records[i][field], date: dateStr };
        }
    }
    return { val: '-', date: '' };
}
// -------------------------------------------------------------
// FILTRO TEMPORALE SUI DATI
// -------------------------------------------------------------
function filterDataByRange(dataArray, dateField, range) {
    if (!dataArray || !dataArray.length || range === 'all') return dataArray;

    const now = new Date();
    let cutoff = new Date();

    if (range === '1w') cutoff.setDate(now.getDate() - 7);
    else if (range === '1m') cutoff.setMonth(now.getMonth() - 1);
    else if (range === '3m') cutoff.setMonth(now.getMonth() - 3);
    else if (range === '6m') cutoff.setMonth(now.getMonth() - 6);

    return dataArray.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= cutoff;
    });
}

// -------------------------------------------------------------
// CALCOLO LINEA DI TREND LINEARE PER CHART.JS
// -------------------------------------------------------------
function calculateTrendline(yValues) {
    const validPoints = yValues.map((y, x) => (y !== null && !isNaN(y)) ? { x, y } : null).filter(p => p !== null);
    if (validPoints.length < 2) return yValues.map(() => null);

    const n = validPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    validPoints.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumXX += p.x * p.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return yValues.map((_, x) => slope * x + intercept);
}
