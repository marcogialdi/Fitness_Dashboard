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
