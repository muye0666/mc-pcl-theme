<template>
  <section class="banner">
    <div class="grid-bg"></div>
    <div class="particles"></div>

    <div class="container banner-inner">
      <div class="banner-text">
        <h1>MCPCL 启动器 主题资源库</h1>
        <h2>PCL2 第三方主题预览与下载</h2>
        <p>收集玩家自制 MCPCL 界面主题，一键复制下载链接</p>
        <div class="tag-chip">PCL2 第三方主题</div>
      </div>

      <div class="banner-visual">
        <div class="cube">
          <div class="face front"></div>
          <div class="face back"></div>
          <div class="face left"></div>
          <div class="face right"></div>
          <div class="face top"></div>
          <div class="face bottom"></div>
        </div>
        <div class="float-cube c1"></div>
        <div class="float-cube c2"></div>
        <div class="float-cube c3"></div>
        <div class="float-cube c4"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  margin-top: 64px;
  padding: 80px 0 70px;
  background: radial-gradient(ellipse at 70% 50%, #0d2a55 0%, #0a1628 40%, #0f1115 100%);
  position: relative; overflow: hidden;
  min-height: 420px;
}
.grid-bg {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(64, 128, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 128, 255, 0.08) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at 70% 50%, #000 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 70% 50%, #000 20%, transparent 70%);
}
.particles {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, #4080ff, transparent),
    radial-gradient(2px 2px at 70% 60%, #6aa8ff, transparent),
    radial-gradient(2px 2px at 40% 80%, #4080ff, transparent),
    radial-gradient(2px 2px at 85% 20%, #6aa8ff, transparent);
  opacity: 0.5;
  animation: float 8s ease-in-out infinite alternate;
}
@keyframes float { from { transform: translateY(0); } to { transform: translateY(-20px); } }

.banner-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 40px; position: relative; z-index: 2;
}
.banner-text { flex: 1; min-width: 0; }
h1 {
  font-size: 44px; font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.2;
  text-shadow: 0 0 40px rgba(64, 128, 255, 0.3);
}
h2 { font-size: 20px; color: #a8c4e8; margin-bottom: 14px; font-weight: 500; }
p { color: #8a9bb5; font-size: 15px; margin-bottom: 18px; }

.tag-chip {
  display: inline-block;
  padding: 6px 16px;
  border: 1px solid rgba(64, 128, 255, 0.5);
  border-radius: 20px;
  color: #6aa8ff;
  font-size: 13px;
  background: rgba(64, 128, 255, 0.08);
}

/* ========== 3D 方块 ========== */
.banner-visual {
  position: relative;
  width: 420px; height: 320px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.cube {
  position: relative;
  width: 120px; height: 120px;
  transform-style: preserve-3d;
  animation: rotateCube 12s linear infinite;
}
.cube .face {
  position: absolute;
  width: 120px; height: 120px;
  border: 2px solid #4080ff;
  background: rgba(64, 128, 255, 0.12);
  box-shadow: 0 0 30px rgba(64, 128, 255, 0.6) inset,
              0 0 40px rgba(64, 128, 255, 0.4);
}
.face.front  { transform: translateZ(60px); }
.face.back   { transform: rotateY(180deg) translateZ(60px); }
.face.left   { transform: rotateY(-90deg) translateZ(60px); }
.face.right  { transform: rotateY(90deg)  translateZ(60px); }
.face.top    { transform: rotateX(90deg)  translateZ(60px); }
.face.bottom { transform: rotateX(-90deg) translateZ(60px); }

@keyframes rotateCube {
  from { transform: rotateX(-20deg) rotateY(0deg); }
  to   { transform: rotateX(-20deg) rotateY(360deg); }
}

.float-cube {
  position: absolute;
  width: 24px; height: 24px;
  background: rgba(64, 128, 255, 0.25);
  border: 1.5px solid #4080ff;
  box-shadow: 0 0 20px rgba(64, 128, 255, 0.7);
  animation: floatUpDown 4s ease-in-out infinite alternate;
}
.float-cube.c1 { top: 10%;  left: 10%;  width: 20px; height: 20px; animation-delay: 0s; }
.float-cube.c2 { top: 20%;  right: 8%;  width: 28px; height: 28px; animation-delay: 1s; }
.float-cube.c3 { bottom: 15%; left: 5%;  width: 16px; height: 16px; animation-delay: 2s; }
.float-cube.c4 { bottom: 8%;  right: 15%; width: 22px; height: 22px; animation-delay: 1.5s; }

@keyframes floatUpDown {
  from { transform: translateY(0) rotate(0deg); }
  to   { transform: translateY(-18px) rotate(45deg); }
}

@media (max-width: 900px) {
  h1 { font-size: 30px; }
  h2 { font-size: 16px; }
  p { font-size: 13px; }
  .banner { padding: 50px 0 40px; }
  .banner-visual { width: 180px; height: 180px; }
  .cube, .cube .face { width: 70px; height: 70px; }
  .face.front  { transform: translateZ(35px); }
  .face.back   { transform: rotateY(180deg) translateZ(35px); }
  .face.left   { transform: rotateY(-90deg) translateZ(35px); }
  .face.right  { transform: rotateY(90deg)  translateZ(35px); }
  .face.top    { transform: rotateX(90deg)  translateZ(35px); }
  .face.bottom { transform: rotateX(-90deg) translateZ(35px); }
}
</style>