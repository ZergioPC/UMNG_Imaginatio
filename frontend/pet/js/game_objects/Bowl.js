// js/game_objects/Bowl.js

export class Bowl {
    constructor(x, y, initialLikes,width,height) {
        this.x = x;
        this.y = y;
        this.deltaX = 25;
        this.deltaY = -30;
        //this.size = [200, 120];
        this.size = [width, height];

        this.likes = initialLikes;
        this.maxLikes = 30;

        this.bowlBack = new Image();
        this.bowlFront = new Image();
        this.food = new Image();

        // Initialize with default paths, these will be updated by setAppearance
        this.bowlBack.src = './img/bowl_texture/PLATO_BASE_bck.png'; 
        this.bowlFront.src = './img/bowl_texture/PLATO_BASE_frnt.png';
        this.food.src = './img/bowl_food_textures/heart.png';

        this.isLoaded = false;
        this.checkLoaded();

        this.randomize = [];
        for (let i = 0; i < this.maxLikes; i++) {
            this.randomize.push([
                (Math.PI/180)*((Math.random() * 6) - 3),
                (Math.random() * 60),
                (Math.random() * 0.1)
            ]);
        }
    }

    setAppearance(frontSrc, backSrc) {              
        // Only update if the source has changed to avoid unnecessary reloads
        if (this.bowlFront.src !== frontSrc) {
            this.bowlFront.src = frontSrc.src;
            this.bowlBack.src = backSrc.src;
            this.checkLoaded(); // Re-check loaded status for new images
        }
    }

    checkLoaded() {
        const images = [this.bowlBack, this.bowlFront, this.food];
        let loadedCount = 0;
        images.forEach(image => {
            image.onload = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    this.isLoaded = true;
                    console.log('Bowl assets loaded.');
                }
            };
        });
    }

    setLikes(likes) {
        this.likes = likes;
    }

    render(ctx) {
        if (!this.isLoaded) {
            return;
        }

        // Draw the back of the bowl
        ctx.drawImage(this.bowlBack, this.x + this.deltaX, this.y + this.deltaY, this.size[0] * 0.75, this.size[1] * 0.5);

        // Draw the food (hearts)
        const foodX = this.x + 120;
        const foodY = this.y - 20;
        const foodSize = 40;

        const centered = -50;

        const likesCounter = (this.likes > this.maxLikes) ? this.maxLikes : this.likes
        
        for (let i = 0; i < likesCounter; i++) {
            ctx.save(); // Save the un-rotated state

            ctx.translate(-centered, centered);      // Move origin to image center
            ctx.rotate(this.randomize[i][0]);
            ctx.translate(centered, -centered);               // Rotate
            //ctx.translate(foodX, foodY);    // Move origin to image center
            
            ctx.drawImage(this.food, 
                foodX - this.randomize[i][1], 
                foodY + this.randomize[i][2], 
                foodSize, 
                foodSize);
            
            ctx.restore(); // Restore original canvas state
            }

        // Draw the front of the bowl
        ctx.drawImage(this.bowlFront, this.x, this.y, this.size[0], this.size[1]);
    }
}
