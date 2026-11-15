/* ===== Simulator ===== */
const preview = document.getElementById('preview');
const photo = document.getElementById('photo');
const sliders = {brightness:'o-b', contrast:'o-c', saturation:'o-s'};

function applyFilter(){
  const b = document.getElementById('brightness').value;
  const c = document.getElementById('contrast').value;
  const s = document.getElementById('saturation').value;
  preview.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  document.getElementById('o-b').textContent = b + '%';
  document.getElementById('o-c').textContent = c + '%';
  document.getElementById('o-s').textContent = s + '%';
}
Object.keys(sliders).forEach(id => document.getElementById(id).addEventListener('input', applyFilter));

document.getElementById('file').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  photo.src = URL.createObjectURL(f);
  photo.hidden = false;
});
document.getElementById('reset').addEventListener('click', () => {
  Object.keys(sliders).forEach(id => document.getElementById(id).value = 100);
  applyFilter();
});

/* ===== Quiz ===== */
const questions = [
  {q:'Jenis color grading apa yang cocok untuk film horor?', o:['Orange sunset yang hangat','Moody: gelap, dingin, saturation rendah','Vintage kuning pudar','Warna pastel cerah'], a:1},
  {q:'Warna dominan pada gaya Teal & Orange adalah...', o:['Hijau dan ungu','Merah dan biru tua','Teal dan oranye','Kuning dan abu-abu'], a:2},
  {q:'Apa tujuan utama color correction?', o:['Membuat gambar bergaya dramatis','Membuat warna gambar akurat dan natural','Menambah efek grain','Mengubah semua warna jadi hitam putih'], a:1},
  {q:'Kombinasi warna yang saling berseberangan di color wheel disebut...', o:['Analogous','Triadic','Complementary','Monochrome'], a:2},
  {q:'Pengaturan apa yang mengubah kekuatan atau intensitas warna?', o:['Saturation','Exposure','Highlights','Sharpness'], a:0},
  {q:'Foto terlihat terlalu kebiruan. Apa yang sebaiknya disesuaikan?', o:['Contrast','White balance','Vignette','Resolusi'], a:1},
  {q:'Gaya yang terasa seperti foto lama dan nostalgia adalah...', o:['Vintage','Cinematic','Teal & Orange','Moody'], a:0},
  {q:'Warna kuning, oranye, dan merah yang bersebelahan termasuk skema...', o:['Complementary','Analogous','Triadic','Split'], a:1}
];
let idx = 0, score = 0;
const $ = id => document.getElementById(id);

function show(){
  const item = questions[idx];
  $('q-count').textContent = `Pertanyaan ${idx+1} dari ${questions.length}`;
  $('q-text').textContent = item.q;
  $('q-fb').textContent = '';
  $('q-next').hidden = true;
  $('q-opts').innerHTML = '';
  item.o.forEach((text, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.addEventListener('click', () => answer(i));
    $('q-opts').appendChild(b);
  });
}
function answer(i){
  const item = questions[idx];
  const btns = $('q-opts').children;
  [...btns].forEach((b, n) => {
    b.disabled = true;
    if (n === item.a) b.classList.add('ok');
    else if (n === i) b.classList.add('no');
  });
  if (i === item.a){ score++; $('q-fb').textContent = 'Benar!'; }
  else $('q-fb').textContent = 'Kurang tepat. Jawaban yang benar ditandai hijau.';
  $('q-next').textContent = idx === questions.length-1 ? 'Lihat skor' : 'Lanjut';
  $('q-next').hidden = false;
}
$('q-next').addEventListener('click', () => {
  idx++;
  if (idx < questions.length) return show();
  $('q-count').textContent = 'Quiz selesai';
  $('q-text').textContent = `Skor kamu ${score} dari ${questions.length}`;
  $('q-opts').innerHTML = '';
  $('q-fb').textContent = score >= 6 ? 'Mantap, kamu sudah paham dasar color grading.' : 'Coba baca tutorial lagi, lalu ulangi quiz-nya.';
  $('q-next').textContent = 'Ulangi quiz';
  $('q-next').onclick = () => location.reload();
});
show();
