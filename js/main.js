(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const burger=$('#burger'), menu=$('#menu');
  burger.onclick=()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
  $$('#menu a').forEach(a=>a.onclick=()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false)});

  // Scroll state: nav shadow, back-to-top, active link
  const secs=$$('main section[id]'), links=$$('#menu a');
  addEventListener('scroll',()=>{
    $('#nav').classList.toggle('scrolled',scrollY>20);
    $('#totop').classList.toggle('show',scrollY>600);
    let cur='';secs.forEach(s=>{if(scrollY>=s.offsetTop-120)cur=s.id});
    links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur));
  },{passive:true});
  $('#totop').onclick=()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  $('#yr').textContent=new Date().getFullYear();

  // Typing roles (all taken from the resume headline)
  const words=['AWS','Microsoft Azure','Python','REST APIs'];let w=0,c=0,del=false;const t=$('#typed');
  if(reduce){t.textContent=words.join(' | ')}else(function tick(){
    const full=words[w];t.textContent=full.slice(0,c);
    if(!del&&c===full.length){del=true;return setTimeout(tick,1300)}
    if(del&&c===0){del=false;w=(w+1)%words.length}
    c+=del?-1:1;setTimeout(tick,del?45:90);
  })();

  // Terminal (only resume facts)
  const out={
    whoami:'Bharathi B\nCloud Engineer | AWS | Microsoft Azure | Python | REST APIs\nB.Tech Information Technology, EGS Pillay Engineering College (2022 - 2026)\nChennai, India',
    skills:'Cloud     : AWS (EC2, S3, IAM, CloudWatch, RDS, VPC, Lambda), Microsoft Azure\nLanguages : Python, C, JavaScript\nBackend   : Flask, Django, Node.js, Express.js, MERN Stack\nSystems   : Linux/Ubuntu, Windows, Bash, Git, GitHub',
    badge:'AWS Cloud Quest: Cloud Practitioner (Training Badge)\nIssued by Amazon Web Services\nVerify: see the Certifications section',
    contact:'Email    : bharathibalachandhiran@gmail.com\nPhone    : +91 8148967496\nLinkedIn : linkedin.com/in/bharathib19\nGitHub   : github.com/bharathibalu19'
  };
  const term=$('#term');
  function run(cmd){
    term.textContent+=(term.textContent?'\n\n':'')+'$ '+cmd+'\n'+out[cmd];term.scrollTop=term.scrollHeight;
  }
  run('whoami');
  $$('#termBtns button').forEach(b=>b.onclick=()=>run(b.dataset.cmd));

  // Skills (from the resume skills table) with filters
  const skills=[
    ['AWS','cloud',1],['Microsoft Azure','cloud',1],['EC2','cloud',1],['S3','cloud',1],['Lambda','cloud',1],['IAM','cloud'],['CloudWatch','cloud'],['RDS','cloud'],['VPC','cloud'],
    ['Compute, Storage, Networking, Database & Security Services','cloud'],
    ['Linux/Ubuntu','tools'],['Windows','tools'],['Shell Scripting (Bash)','tools'],['Git','tools'],['GitHub','tools'],
    ['Python','code',1],['C','code'],['JavaScript','code'],['Data Structures & Algorithms','code'],['Object-Oriented Programming','code'],
    ['Flask','backend'],['Django','backend'],['Node.js','backend'],['Express.js','backend'],['REST APIs','backend',1],['MERN Stack','backend'],['HTML5','backend'],['CSS3','backend'],['React.js','backend'],
    ['MySQL','data'],['MongoDB','data'],['SQLite','data'],['DBMS','data']
  ];
  const chips=$('#chips');
  function render(f){
    chips.innerHTML='';
    skills.filter(s=>f==='all'||s[1]===f).forEach((s,i)=>{
      const d=document.createElement('span');d.className='chip'+(s[2]?' hl':'');d.textContent=s[0];d.style.animationDelay=(i*25)+'ms';chips.appendChild(d);
    });
  }
  render('all');
  $$('#tabs button').forEach(b=>b.onclick=()=>{$$('#tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');render(b.dataset.f)});

  // Reveal on scroll + count-up
  $$('.sec .wrap > *, .card, .cert').forEach(e=>e.classList.add('reveal'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
    e.target.querySelectorAll?.('[data-count]').forEach(count);
  }),{threshold:.15});
  $$('.reveal').forEach(e=>io.observe(e));
  function count(el){
    const to=+el.dataset.count,dec=+el.dataset.dec||0,suf=el.dataset.suffix||'';
    if(reduce){el.textContent=to.toFixed(dec)+suf;return}
    const st=performance.now();
    (function f(n){const p=Math.min((n-st)/1200,1);el.textContent=(to*p).toFixed(dec)+suf;if(p<1)requestAnimationFrame(f)})(st);
  }

  // Contact form: opens the visitor's email app (no backend needed on GitHub Pages)
  $('#form').addEventListener('submit',e=>{
    e.preventDefault();const f=e.target,s=$('#status');
    if(!f.name.value.trim()||!/^\S+@\S+\.\S+$/.test(f.email.value)||!f.msg.value.trim()){
      s.className='status err';s.textContent='Enter your name, a valid email and a message.';return;
    }
    const body=encodeURIComponent(f.msg.value+'\n\nFrom: '+f.name.value+' <'+f.email.value+'>');
    location.href='mailto:bharathibalachandhiran@gmail.com?subject='+encodeURIComponent('Portfolio message from '+f.name.value)+'&body='+body;
    s.className='status';s.textContent='Your email app should open with the message ready to send.';
  });
})();
