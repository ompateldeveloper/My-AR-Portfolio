import { CSS3DObject } from '../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { loadGLTF, loadTexture, loadTextures, loadVideo } from '../libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {

        // initialize MindAR 
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: '../assets/targets/Bussiness-card.mind',
        });
        const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const [
            cardTexture,
            emailTexture,
            locationTexture,
            webTexture,
            profileTexture,
            portfolioItem0Texture,
            //   portfolioItem1Texture,
            //   portfolioItem2Texture,
        ] = await loadTextures([
            '../../assets/targets/Bussiness-card.png',
            '../../assets/portfolio/icons/email.png',
            '../../assets/portfolio/icons/phone.png',
            '../../assets/portfolio/icons/web.png',
            '../../assets/portfolio/icons/profile.png',
            '../../assets/portfolio/portfolio/preview1.png',
        ]);

        const planeGeometry = new THREE.PlaneGeometry(1, 0.552);
        const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        const card = new THREE.Mesh(planeGeometry, cardMaterial);

        const iconGeometry = new THREE.CircleGeometry(0.075, 32);
        const emailMaterial = new THREE.MeshBasicMaterial({ map: emailTexture });
        const webMaterial = new THREE.MeshBasicMaterial({ map: webTexture });
        const profileMaterial = new THREE.MeshBasicMaterial({ map: profileTexture });
        const locationMaterial = new THREE.MeshBasicMaterial({ map: locationTexture });

        const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
        const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
        const profileIcon = new THREE.Mesh(iconGeometry, profileMaterial);
        const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);


        const portfolioItem0Video = await loadVideo("../assets/portfolio/portfolio/preview.mp4");
        portfolioItem0Video.muted = true;
        const portfolioItem0VideoTexture = new THREE.VideoTexture(portfolioItem0Video);
        const portfolioItem0VideoMaterial = new THREE.MeshBasicMaterial({ map: portfolioItem0VideoTexture });
        const portfolioItem0Material = new THREE.MeshBasicMaterial({ map: portfolioItem0Texture });


        const portfolioItem0V = new THREE.Mesh(planeGeometry, portfolioItem0VideoMaterial);
        const portfolioItem0 = new THREE.Mesh(planeGeometry, portfolioItem0Material);
        // const portfolioItem1 = new THREE.Mesh(planeGeometry, portfolioItem1Material); 
        // const portfolioItem2 = new THREE.Mesh(planeGeometry, portfolioItem2Material); 

        profileIcon.position.set(-0.42, -0.5, 0);
        webIcon.position.set(-0.14, -0.5, 0);
        emailIcon.position.set(0.14, -0.5, 0);
        locationIcon.position.set(0.42, -0.5, 0);

        const portfolioGroup = new THREE.Group();
        portfolioGroup.position.set(0, 0, -0.01);
        portfolioGroup.position.set(0, 0.6, -0.01);

        // portfolioItem0V.position.set(0, 0, 0)

        portfolioGroup.add(portfolioItem0);
        portfolioGroup.add(portfolioItem0V);
        // portfolioGroup.add(leftIcon);
        // portfolioGroup.add(rightIcon);
        // leftIcon.position.set(-0.7, 0, 0);
        // rightIcon.position.set(0.7, 0, 0);

        const avatar = await loadGLTF('../assets/models/business_card_background/scene.gltf');
        avatar.scene.scale.set(0.004, 0.004, 0.004);
        avatar.scene.position.set(0, -0.25, -0.3);
        portfolioItem0V.position.set(0, 0.6, 0); 


        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(avatar.scene);
        anchor.group.add(card);
        anchor.group.add(emailIcon);
        anchor.group.add(webIcon);
        anchor.group.add(profileIcon);
        anchor.group.add(locationIcon);
        anchor.group.add(portfolioItem0V);
        anchor.group.add(portfolioGroup);

        anchor.onTargetFound = () => {
            portfolioItem0V.material.map.image.play();
        }
        anchor.onTargetLost = () => {
            portfolioItem0V.material.map.image.pause();
        }
        portfolioItem0V.material.map.image.addEventListener('play', () => {
            portfolioItem0V.material.map.image.currentTime = 1;
        });


        const textElement = document.createElement("div");
        const textObj = new CSS3DObject(textElement);
        textObj.position.set(0, -800, 0);
        textObj.visible = false;
        textElement.style.background = "#FFFFFF";
        textElement.style.padding = "30px";
        textElement.style.fontSize = "60px";

        const cssAnchor = mindarThree.addCSSAnchor(0);
        cssAnchor.group.add(textObj);

        // handle buttons

        emailIcon.userData.clickable = true;
        webIcon.userData.clickable = true;
        profileIcon.userData.clickable = true;
        locationIcon.userData.clickable = true;
        portfolioItem0.userData.clickable = true;
        portfolioItem0V.userData.clickable = true;

        const portfolioItems = [portfolioItem0];
        let currentPortfolio = 0;

        document.body.addEventListener('click', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            const mouse = new THREE.Vector2(mouseX, mouseY);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
        
            if (intersects.length > 0) {
                let o = intersects[0].object;
                while (o.parent && !o.userData.clickable) {
                    o = o.parent;
                }
                if (o.userData.clickable) {
                    if (o === webIcon) {
                        // Open the GitHub link
                        window.open("https://github.com/nikkuboiii", "_blank");
                    } else if (o === emailIcon) {
                        // Open the email link
                        window.open("mailto:nikhil@gmail.com", "_blank");
                    } else if (o === profileIcon) {
                        // Open the portfolio link
                        window.open("https://nikhilgargsportfolio.netlify.app/", "_blank");
                    } else if (o === locationIcon) {
                        // Display location information
                        textObj.visible = true;
                        textElement.innerHTML = "Greetings! I go by the name Nikhil Garg, and I'm a pleasant software developer.";
                    }
                }
            }
        });
        

        const clock = new THREE.Clock();
        await mindarThree.start();
        const rotationSpeed = 0.5;

        // Create a quaternion to store the rotation state
        const quaternion = new THREE.Quaternion();



        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            
            // Update rotation based on time and speed
            const rotationAngle = delta * rotationSpeed;
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle);

            // Apply the rotation to the avatar's scene
            avatar.scene.quaternion.multiply(quaternion);


            const elapsed = clock.getElapsedTime();
            const iconScale = 1 + 0.2 * Math.sin(elapsed * 5);


            [webIcon, emailIcon, profileIcon, locationIcon].forEach((icon) => {
                icon.scale.set(iconScale, iconScale, iconScale);
            });

            const avatarZ = Math.min(0.3, -0.3 + elapsed * 0.5);
            avatar.scene.position.set(1.3, -0.25, avatarZ);


            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
        });
    }
    start();
});
