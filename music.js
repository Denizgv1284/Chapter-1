// The player shell stays usable while provider credentials are not configured.
(() => {
  const panel=document.querySelector('#musicPlayer');
  const open=document.querySelector('#musicOpen');
  const handle=document.querySelector('#musicDrag');
  let drag=null;
  function clampPanel(left,top) {
    const width=window.visualViewport?.width || innerWidth;
    const height=window.visualViewport?.height || innerHeight;
    panel.style.maxHeight=`${Math.max(80,height-16)}px`;
    const box=panel.getBoundingClientRect();
    panel.style.left=`${Math.max(8,Math.min(left,width-box.width-8))}px`;
    panel.style.top=`${Math.max(8,Math.min(top,height-box.height-8))}px`;
    panel.style.right='auto';
  }
  function close(){panel.hidden=true;open.setAttribute('aria-expanded','false');open.focus({preventScroll:true});}
  open.addEventListener('click',()=>{
    if(!panel.hidden){close();return;}
    panel.hidden=false;open.setAttribute('aria-expanded','true');
    document.querySelector('#musicStatus').textContent='Hesap bağlantıları henüz kullanıma açılmadı.';
    clampPanel(innerWidth-panel.offsetWidth-12,90);
    document.querySelector('#musicClose').focus({preventScroll:true});
  });
  document.querySelector('#musicClose').addEventListener('click',close);
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();}});
  handle.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const box=panel.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX-box.left,y:event.clientY-box.top};
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove',event=>{if(drag?.id===event.pointerId)clampPanel(event.clientX-drag.x,event.clientY-drag.y);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(name=>handle.addEventListener(name,()=>{drag=null;}));
  handle.addEventListener('keydown',event=>{
    const delta={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}[event.key];
    if(!delta)return;event.preventDefault();const box=panel.getBoundingClientRect();clampPanel(box.left+delta[0],box.top+delta[1]);
  });
  function resize(){if(!panel.hidden){const box=panel.getBoundingClientRect();clampPanel(box.left,box.top);}}
  window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
})();
