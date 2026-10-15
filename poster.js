/* Shared layout for a phone-readable, single-column guide image. */
(function(global){
'use strict';
const FONT='"Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", sans-serif';
function lines(ctx,text,width){const out=[];let line='';for(const ch of String(text||'')){if(ch==='\n'){out.push(line);line=''}else if(line&&ctx.measureText(line+ch).width>width){out.push(line);line=ch}else line+=ch}if(line||!out.length)out.push(line);return out}
function box(ctx,x,y,w,h,r,color){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=color;ctx.fill()}
function textLines(ctx,text,x,y,width,lineHeight){const ls=lines(ctx,text,width);ls.forEach((t,i)=>ctx.fillText(t,x,y+i*lineHeight));return ls.length*lineHeight}
function renderGuidePoster(state,characters,images,canvas){
 const ctx=canvas.getContext('2d'),W=1080,pad=44,gw=W-pad*2,inner=28,gap=16,cw=(gw-inner*2-gap*3)/4,ch=cw+60;
 ctx.font='bold 58px '+FONT;const titleLines=lines(ctx,state.title||'我的推荐攻略',W-112);ctx.font='28px '+FONT;const introLines=state.intro?lines(ctx,state.intro,W-136):[];
 const top=122+(titleLines.length-1)*76+(introLines.length?58+(introLines.length-1)*43:0)+54;
 const layouts=state.groups.map(g=>{ctx.font='27px '+FONT;const note=(g.note&&g.note!=='输入配队思路或关卡说明…')?g.note:'';const noteLines=note?lines(ctx,note,gw-2*inner):[];ctx.font='bold 35px '+FONT;const headings=lines(ctx,g.title||'推荐配队',gw-150);const header=38+headings.length*49+(noteLines.length?14+noteLines.length*40:0)+25;const rows=Math.ceil(g.slots.length/4);return {noteLines,headings,header,rows,height:header+rows*(ch+64)+16}});
 const total=top+layouts.reduce((sum,g)=>sum+g.height+28,0)+95;const scale=Math.min(1,30000/total);canvas.width=Math.round(W*scale);canvas.height=Math.round(total*scale);ctx.scale(scale,scale);ctx.fillStyle='#f5f4ec';ctx.fillRect(0,0,W,total);
 ctx.textAlign='left';ctx.fillStyle='#8a957f';ctx.font='20px '+FONT;ctx.fillText('提瓦特  /  攻略笔记',pad,51);ctx.textAlign='right';ctx.fillStyle='#a18b53';ctx.fillText('STRATEGY GUIDE',W-pad,51);ctx.textAlign='center';ctx.fillStyle='#213f34';ctx.font='bold 58px '+FONT;titleLines.forEach((t,i)=>ctx.fillText(t,W/2,122+i*76));ctx.font='28px '+FONT;ctx.fillStyle='#737f69';const introTop=122+(titleLines.length-1)*76+58;introLines.forEach((t,i)=>ctx.fillText(t,W/2,introTop+i*43));
 let y=top;
 state.groups.forEach((g,gi)=>{const l=layouts[gi];box(ctx,pad,y,gw,l.height,26,'#ffffff');box(ctx,pad,y,7,l.height,3,'#55765b');box(ctx,pad+inner,y+28,56,46,12,'#eaf0e3');ctx.textAlign='center';ctx.font='bold 23px '+FONT;ctx.fillStyle='#4f6b4d';ctx.fillText(String(gi+1).padStart(2,'0'),pad+inner+28,y+59);ctx.textAlign='left';ctx.font='bold 35px '+FONT;ctx.fillStyle='#2e4536';l.headings.forEach((t,i)=>ctx.fillText(t,pad+inner+76,y+61+i*49));ctx.font='27px '+FONT;ctx.fillStyle='#7c856d';const noteY=y+38+l.headings.length*49+18;l.noteLines.forEach((t,i)=>ctx.fillText(t,pad+inner,noteY+i*40));
 for(let ri=0;ri<l.rows;ri++){const ry=y+l.header+ri*(ch+64);ctx.font='22px '+FONT;ctx.fillStyle='#95a287';ctx.textAlign='left';ctx.fillText('配队 '+String(ri+1).padStart(2,'0'),pad+inner,ry+19);ctx.strokeStyle='#edf0e7';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad+inner+105,ry+12);ctx.lineTo(W-pad-inner,ry+12);ctx.stroke();
 for(let col=0;col<4;col++){const si=ri*4+col;if(si>=g.slots.length)break;const id=g.slots[si],c=characters.find(c=>c.id===id),im=images.get(id),x=pad+inner+col*(cw+gap),sy=ry+34;box(ctx,x,sy,cw,ch,12,'#f4f2e7');ctx.save();ctx.beginPath();ctx.roundRect(x,sy,cw,ch,12);ctx.clip();if(im&&c){ctx.drawImage(im,x,sy,cw,cw);ctx.fillStyle='#334637';let fs=30;ctx.font='bold '+fs+'px '+FONT;while(ctx.measureText(c.name).width>cw-12&&fs>16){fs--;ctx.font='bold '+fs+'px '+FONT}ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c.name,x+cw/2,sy+cw+30);ctx.textBaseline='alphabetic'}else{ctx.font='25px '+FONT;ctx.fillStyle='#a4aa98';ctx.textAlign='center';ctx.fillText('待选角色',x+cw/2,sy+ch/2)}ctx.restore()}
 }
 y+=l.height+28;
 });ctx.textAlign='left';ctx.font='21px '+FONT;ctx.fillStyle='#99a18c';ctx.fillText('提瓦特 · 配队笔记',pad,total-33);ctx.textAlign='right';ctx.fillText('愿每次冒险，都有好搭档 ✧',W-pad,total-33);return {width:canvas.width,height:canvas.height,groupCount:state.groups.length};
}
global.renderGuidePoster=renderGuidePoster;
})(typeof window==='undefined'?globalThis:window);
