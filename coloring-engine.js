// Fill only the connected area under the chosen point, keeping original outlines intact.
export function floodFill(pixels,width,height,x,y,hex,protectedPixels=null,tolerance=24){
 x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=width||y>=height)return 0;
 const start=y*width+x;if(protectedPixels?.[start])return 0;
 const rgb=hex.replace('#','');if(!/^[0-9a-f]{6}$/i.test(rgb))throw Error('Invalid color');
 const replacement=[0,2,4].map(i=>parseInt(rgb.slice(i,i+2),16));const o=start*4,target=[pixels[o],pixels[o+1],pixels[o+2],pixels[o+3]];
 if(replacement.every((v,i)=>v===target[i])&&target[3]===255)return 0;
 const visited=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=1,count=0;queue[0]=start;visited[start]=1;
 const matches=i=>{if(protectedPixels?.[i])return false;const k=i*4;return Math.abs(pixels[k]-target[0])<=tolerance&&Math.abs(pixels[k+1]-target[1])<=tolerance&&Math.abs(pixels[k+2]-target[2])<=tolerance&&Math.abs(pixels[k+3]-target[3])<=tolerance};
 while(head<tail){const p=queue[head++];if(!matches(p))continue;const k=p*4;pixels[k]=replacement[0];pixels[k+1]=replacement[1];pixels[k+2]=replacement[2];pixels[k+3]=255;count++;
  const col=p%width;for(const n of [col>0?p-1:-1,col<width-1?p+1:-1,p>=width?p-width:-1,p<width*(height-1)?p+width:-1])if(n>=0&&!visited[n]){visited[n]=1;queue[tail++]=n}
 }return count;
}
export function lineMask(pixels){const mask=new Uint8Array(pixels.length/4);for(let i=0;i<mask.length;i++){const k=i*4;mask[i]=pixels[k]<100&&pixels[k+1]<100&&pixels[k+2]<120&&pixels[k+3]>200?1:0}return mask}
