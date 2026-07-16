import { Component, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cardMesh!: THREE.Mesh;
  private pointLight!: THREE.PointLight;
  private animationFrameId!: number;

  // Interaction targets
  private targetRotationX = 0;
  private targetRotationY = 0;
  private mouseX = 0;
  private mouseY = 0;
  private floatTime = 0;

  // Window event listeners references
  private resizeListener = () => this.onWindowResize();
  private mouseMoveListener = (e: MouseEvent) => this.onMouseMove(e);

  features = signal([
    {
      icon: 'fa-solid fa-shield-halved',
      title: '100% Privacy Preserved',
      desc: 'Finders can notify you about your vehicle without ever knowing your phone number, email, or name.'
    },
    {
      icon: 'fa-solid fa-bolt',
      title: 'Instant Alerts',
      desc: 'Receive alerts via Email and SMS the exact moment someone scans your vehicle\'s QR code.'
    },
    {
      icon: 'fa-solid fa-car-side',
      title: 'Fleet & Vehicle Management',
      desc: 'Manage your entire personal or commercial fleet from a single consolidated customer dashboard.'
    },
    {
      icon: 'fa-solid fa-chart-line',
      title: 'Analytics & History',
      desc: 'Track notification logs, timestamps, and scan statistics to monitor your fleet\'s status.'
    }
  ]);

  pricingPlans = signal([
    {
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      features: ['1 Registered vehicle', 'Limited notifications', 'Email alerts', 'Basic support'],
      action: 'Register Free',
      popular: false
    },
    {
      name: 'Premium Monthly',
      price: '$4.99',
      period: 'month',
      features: ['Unlimited vehicles', 'Unlimited alerts', 'Email & SMS alerts', 'Priority support', 'Dashboard analytics'],
      action: 'Go Premium',
      popular: true
    },
    {
      name: 'Premium Annual',
      price: '$49.99',
      period: 'year',
      features: ['All Premium benefits', 'Save 17% annually', 'Direct support hotline', '1 Free physical QR decal'],
      action: 'Get Annual',
      popular: false
    }
  ]);

  faqs = signal([
    {
      question: 'How do finders notify me?',
      answer: 'Anyone who notices an issue with your vehicle (e.g. windows left open, lights on, parking block) scans the QR code on your windshield. This opens a secure contact form where they select the issue. Our system instantly routes the alert to you.',
      open: false
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes. We act as a middleman. The finder only sees a generic form, and all communication is anonymized. We never share your phone number, email, or name.',
      open: false
    },
    {
      question: 'Do finders need to install an app?',
      answer: 'No app is required! The finder scans the QR code using their default phone camera, which opens a fast, responsive web form to submit the notification.',
      open: false
    }
  ]);

  toggleFaq(index: number) {
    this.faqs.update(list => {
      list[index].open = !list[index].open;
      return [...list];
    });
  }

  ngAfterViewInit() {
    this.initThree();
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('mousemove', this.mouseMoveListener);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('mousemove', this.mouseMoveListener);
    
    // Dispose resources
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 380;
    const height = canvas.clientHeight || 480;

    // Create scene with transparent background
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.z = 8;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Dynamic QR Canvas Texture (1024x1440 for Ultra-Sharp resolution)
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 1024;
    qrCanvas.height = 1440;
    const ctx = qrCanvas.getContext('2d');
    if (ctx) {
      // Clear canvas to make corners transparent
      ctx.clearRect(0, 0, 1024, 1440);

      // Create rounded rectangle path for the card body
      const x = 30, y = 30, w = 964, h = 1380, r = 80;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();

      // Card Background: Glowing dark carbon/indigo gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
      bgGrad.addColorStop(0, '#0f172a'); // Deep slate dark
      bgGrad.addColorStop(0.5, '#1e293b'); // Sleek slate mid
      bgGrad.addColorStop(1, '#020617'); // Dark void bottom
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Glowing outer gradient border
      const borderGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
      borderGrad.addColorStop(0, '#dfb23f'); // Gold
      borderGrad.addColorStop(0.5, '#6366f1'); // Indigo
      borderGrad.addColorStop(1, '#06b6d4'); // Cyan
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 18;
      ctx.stroke();

      // High-tech glowing grid background lines
      ctx.strokeStyle = 'rgba(223, 178, 63, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 80; i < 960; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 220);
        ctx.lineTo(i, 1120);
        ctx.stroke();
      }
      for (let j = 220; j < 1120; j += 60) {
        ctx.beginPath();
        ctx.moveTo(80, j);
        ctx.lineTo(940, j);
        ctx.stroke();
      }

      // Premium Header Banner
      ctx.fillStyle = 'rgba(223, 178, 63, 0.12)';
      ctx.beginPath();
      ctx.roundRect(80, 80, 864, 160, 30);
      ctx.fill();
      ctx.strokeStyle = 'rgba(223, 178, 63, 0.4)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRAFFTAG SECURITY SYSTEM', 512, 172);

      // QR Finder pattern top-left (Glowing Neon Cyan & White)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(140, 340, 200, 200, 40);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(180, 380, 120, 120, 24);
      ctx.fill();
      ctx.fillStyle = '#38bdf8'; // neon cyan
      ctx.beginPath();
      ctx.roundRect(210, 410, 60, 60, 12);
      ctx.fill();

      // QR Finder pattern top-right
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(684, 340, 200, 200, 40);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(724, 380, 120, 120, 24);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(754, 410, 60, 60, 12);
      ctx.fill();

      // QR Finder pattern bottom-left
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(140, 880, 200, 200, 40);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(180, 920, 120, 120, 24);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(210, 950, 60, 60, 12);
      ctx.fill();

      // High fidelity QR Matrix simulation blocks (Neon Cyan & White)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(400, 340, 80, 80);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(520, 380, 100, 60);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(440, 480, 180, 60);
      
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(684, 600, 80, 160);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(804, 640, 80, 80);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(380, 640, 220, 80);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(140, 600, 80, 80);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(260, 680, 80, 140);
      
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(400, 800, 120, 140);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(560, 880, 80, 80);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(560, 760, 180, 80);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(684, 960, 100, 120);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(820, 880, 64, 160);

      // Scanner Helper Text (White/Cyan glow)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN QR TO ALERT OWNER', 512, 1170);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('100% Anonymized Privacy Shield', 512, 1220);

      // Dynamic Barcode Simulation at the bottom (White lines)
      const startBarcodeX = 352;
      const barcodeY = 1260;
      const barcodeHeights = 50;
      const barcodeWidths = [6, 12, 6, 18, 12, 6, 24, 6, 12, 18, 6, 12, 6, 24, 12, 6, 18];
      let currentX = startBarcodeX;
      
      ctx.fillStyle = '#ffffff';
      for (const barWidth of barcodeWidths) {
        ctx.fillRect(currentX, barcodeY, barWidth, barcodeHeights);
        currentX += barWidth + 8;
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('Serial: TT-482-901', 512, 1352);
    }
    const qrTexture = new THREE.CanvasTexture(qrCanvas);

    // Geometries & Materials
    const geometry = new THREE.BoxGeometry(3, 4.3, 0.12);
    
    // Polished high-reflective metal frame/sides
    const sideMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, // Silver Chrome
      roughness: 0.05, 
      metalness: 1.0 
    });
    
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: qrTexture,
      roughness: 0.01, // highly glossy
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transmission: 0.4, // shiny acrylic glass transmission
      thickness: 1.5,
      transparent: true
    });
    
    const backMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.2,
      transparent: true
    });

    const materials = [
      sideMaterial, // right
      sideMaterial, // left
      sideMaterial, // top
      sideMaterial, // bottom
      frontMaterial, // front
      backMaterial // back
    ];

    this.cardMesh = new THREE.Mesh(geometry, materials);
    this.scene.add(this.cardMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // brighter ambient light
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8); // strong front-right light
    dirLight1.position.set(5, 5, 8);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.8); // purple mood fill
    dirLight2.position.set(-6, -6, 4);
    this.scene.add(dirLight2);

    this.pointLight = new THREE.PointLight(0x38bdf8, 2.5, 15); // moving high-tech cyan spotlight
    this.pointLight.position.set(0, 0, 4);
    this.scene.add(this.pointLight);

    // Start animation loop
    this.animate();
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Float calculations
    this.floatTime += 0.015;
    const floatOffset = Math.sin(this.floatTime) * 0.15;

    // Apply rotation physics with mouse damping
    const targetYRot = this.targetRotationY + (this.mouseX * 0.4);
    const targetXRot = this.targetRotationX + (this.mouseY * 0.3);

    this.cardMesh.rotation.y += (targetYRot - this.cardMesh.rotation.y) * 0.08;
    this.cardMesh.rotation.x += (targetXRot - this.cardMesh.rotation.x) * 0.08;

    // Add idle spin
    this.targetRotationY = Math.sin(this.floatTime * 0.5) * 0.12;

    // Update position for float
    this.cardMesh.position.y = floatOffset;

    // Point light moves with mouse
    this.pointLight.position.x = this.mouseX * 3.5;
    this.pointLight.position.y = -this.mouseY * 3.5;

    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(event: MouseEvent) {
    // Normalize coordinates to -1 to +1
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onWindowResize() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }
}
