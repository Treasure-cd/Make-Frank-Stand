  import * as Matter from 'matter-js';

window.addEventListener('DOMContentLoaded', () => {

/** @type {import('matter-js').Engine} */

const Engine = Matter.Engine;
      const Render = Matter.Render;
      const Runner = Matter.Runner;
      const Bodies = Matter.Bodies;
      const Composite = Matter.Composite;
      const Mouse = Matter.Mouse;
      const MouseConstraint = Matter.MouseConstraint;
      const Constraint = Matter.Constraint;


      const engine = Engine.create();
      const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
        } 
      });
      window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;

  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
});
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });
      
      Composite.add(engine.world, mouseConstraint);

      const LeftLeg = Bodies.rectangle(window.innerWidth/2 - 22, 540, 10, 80);
      const RightLeg = Bodies.rectangle(window.innerWidth/2 + 22, 540, 10, 80);
      const Torso = Bodies.rectangle(window.innerWidth/2, 455, 100, 100);
      let Head = Bodies.circle(window.innerWidth/2, 365, 70);
      const ground = Bodies.rectangle(window.innerWidth/2, 580, window.innerWidth, 30, { isStatic: true });



      const torsoWidth = Torso.bounds.max.x - Torso.bounds.min.x;
      const LeftLegHeight = LeftLeg.bounds.max.y - LeftLeg.bounds.min.y; //same as right
      const LeftLegWidth = LeftLeg.bounds.max.x - LeftLeg.bounds.min.x;
  // Reusable button functionality
  let positions = {
  head: 0,
  leftLeg: -20,
  rightLeg: 20
};

function buttonIncrease(constraintObj, buttonID, key) {  
  const increaseButton = document.getElementById(buttonID);

  if (!increaseButton) {
    console.warn(`Button with ID '${buttonID}' not found.`);
    return;
  }

  function handleIncrease() {
    positions[key] += 5;
   // console.log(positions[key]);
    constraintObj.pointA.x = positions[key];
   // console.log("Clicked");
  }

  increaseButton.addEventListener('click', handleIncrease);
  return { button: increaseButton, handler: handleIncrease };
}

function buttonDecrease(constraintObj, buttonID, key) {
  const decreaseButton = document.getElementById(buttonID);
  if (!decreaseButton) {
    console.warn(`Button with ID '${buttonID}' not found.`);
    return;
  }
  function handleDecrease() {
    positions[key] -= 5;
   // console.log(positions[key]);
    constraintObj.pointA.x = positions[key];
  }

  decreaseButton.addEventListener('click', handleDecrease);

  return { button: decreaseButton, handler: handleDecrease };
}

      // Constraint between Head and Torso
      const torsoHeadConstraint = Constraint.create({
        bodyA: Torso,
        bodyB: Head,
        pointA: { x: 0, y: -50 },
        pointB: { x: 0, y: 70 },
        stiffness: 1,
        length: 0
      });

      // Constraint between Torso and First Leg
      const torsoLeftLegConstraint = Constraint.create({
        bodyA: Torso,
        bodyB: LeftLeg,
        pointA: { x: -20, y: 50 },
        pointB: { x: 0, y: -40 },
        stiffness: 1,
        length: 0
      });

      // Constraint between Torso and Second Leg
      const torsoRightLegConstraint = Constraint.create({
        bodyA: Torso,
        bodyB: RightLeg,
        pointA: { x: 20, y: 50 },
        pointB: { x: 0, y: -40 },
        stiffness: 1,
        length: 0
      });
    /*   const torsoHeadConstraintClone = Constraint.create({
        bodyA: TorsoClone,
        bodyB: HeadClone,
        pointA: { x: 0, y: -50 },
        pointB: { x: 0, y: 50 },
        stiffness: 1,
        length: 0
      });

      // Constraint between Torso and First Leg
      const torsoLeftLegConstraintClone = Constraint.create({
        bodyA: TorsoClone,
        bodyB: LeftLegClone,
        pointA: { x: -20, y: 50 },
        pointB: { x: 0, y: -40 },
        stiffness: 1,
        length: 0
      });

      // Constraint between Torso and Second Leg
      const torsoRightLegConstraintClone = Constraint.create({
        bodyA: TorsoClone,
        bodyB: RightLegClone,
        pointA: { x: 20, y: 50 },
        pointB: { x: 0, y: -40 },
        stiffness: 1,
        length: 0
      });*/

      // Set up button functionality
     const headTorsoButtonControlRight = buttonIncrease(torsoHeadConstraint, 'change-constraintsHead', 'head');
      const leftLegButtonControlRight = buttonIncrease(torsoLeftLegConstraint, 'change-constraintsLeg1', 'leftLeg');
      const rightLegButtonControlRight = buttonIncrease(torsoRightLegConstraint, 'change-constraintsLeg2', 'rightLeg');
      const headTorsoButtonControlLeft = buttonDecrease(torsoHeadConstraint, 'change-constraintsHeadOpp', 'head');
      const leftLegButtonControlLeft = buttonDecrease(torsoLeftLegConstraint, 'change-constraintsLeg1Opp', 'leftLeg');
      const rightLegButtonControlLeft = buttonDecrease(torsoRightLegConstraint, 'change-constraintsLeg2Opp', 'rightLeg');

      // Remove button power if torso is above a certain height
      let leftLegEnabled = true;
      let rightLegEnabled = true;
      let headEnabled = true;




Matter.Events.on(engine, 'afterUpdate', function() {
  const torsoTooLow = Torso.position.y >= ground.position.y - LeftLegHeight - 50;
 // console.log(torsoTooLow);
  // Conditions for enabling/disabling buttons
  const headConditionNegative = Head.position.x <= (Torso.position.x - (torsoWidth / 2));
  const headConditionPositive = Head.position.x >= (Torso.position.x + (torsoWidth / 2));
  const leftLegConditionNegative = LeftLeg.position.x >= (Torso.position.x - (LeftLegWidth / 2));
  const leftLegConditionPositive = LeftLeg.position.x <= Torso.position.x - ((0.5 * torsoWidth) - 10);
  const rightLegConditionNegative = RightLeg.position.x <= (Torso.position.x + (LeftLegWidth / 2));
  const rightLegConditionPositive = RightLeg.position.x >= Torso.position.x + (0.5 * torsoWidth);

 
    //Condition checks
  const headTooFar = headConditionNegative || headConditionPositive; 
  const leftLegTooFar = leftLegConditionNegative || leftLegConditionPositive; 
  const rightLegtooFar = rightLegConditionNegative || rightLegConditionPositive; 

  
  
  // Disable buttons based on conditions
  if (torsoTooLow) {
    if (leftLegEnabled) {
      headTorsoButtonControlRight.button.disabled = true;
      leftLegButtonControlRight.button.disabled = true;
      rightLegButtonControlRight.button.disabled = true;
      headTorsoButtonControlLeft.button.disabled = true;
      leftLegButtonControlLeft.button.disabled = true;
      rightLegButtonControlLeft.button.disabled = true;
      leftLegEnabled = false;
      rightLegEnabled = false;
      headEnabled = false;
      
    }
  } else {
    if (!leftLegEnabled) {
      headTorsoButtonControlRight.button.disabled = false;
      leftLegButtonControlRight.button.disabled = false;
      rightLegButtonControlRight.button.disabled = false;
      headTorsoButtonControlLeft.button.disabled = false;
      leftLegButtonControlLeft.button.disabled = false;
      rightLegButtonControlLeft.button.disabled = false;
      leftLegEnabled = true;
      rightLegEnabled = true;
      headEnabled = true;
    }
  };

  // Check if the head or legs are too far from the torso

  if (headTooFar) {
    if (headEnabled) {
      if (headConditionNegative) {
        headTorsoButtonControlRight.button.disabled = true;
      }
      else if (headConditionPositive){
        headTorsoButtonControlLeft.button.disabled = true;
      }
      headEnabled = false;
    }
  } else {
    if (!headEnabled) {
      headTorsoButtonControlRight.button.disabled = false;
      headTorsoButtonControlLeft.button.disabled = false;
      headEnabled = true;
    }
  };

  if (leftLegTooFar) {
    if (leftLegEnabled) {
           if (leftLegConditionNegative) {
        leftLegButtonControlRight.button.disabled = true;
      }
      else if (leftLegConditionPositive) {
         leftLegButtonControlLeft.button.disabled = true;
      }
      leftLegEnabled = false;
    }
  } else {
    if (!leftLegEnabled) {
      leftLegButtonControlRight.button.disabled = false;
      leftLegButtonControlLeft.button.disabled = false;
      leftLegEnabled = true;
    }
  };

  if (rightLegtooFar) {
       if (rightLegEnabled) {
           if (rightLegConditionNegative) {
         rightLegButtonControlLeft.button.disabled = true;
      //   console.log("Leg2 condition negative");
      }
      else if (rightLegConditionPositive) {
         rightLegButtonControlRight.button.disabled = true;
       //  console.log("Leg2 condition positive");
      }
      rightLegEnabled = false;
    }
  } else {
    if (!rightLegEnabled) {
      rightLegButtonControlRight.button.disabled = false;
      rightLegButtonControlLeft.button.disabled = false;
      rightLegEnabled = true;
    }

  };

let intervalId;
let count = 5;

const check = function checkCompletion() {
  const currentTorsoTooLow = Torso.position.y >= ground.position.y - LeftLegHeight - 50;

  if (!currentTorsoTooLow) {
    Composite.remove(engine.world, mouseConstraint);
    count--;
    textdiv.textContent = count;

    if (count <= 0) {
    Composite.add(engine.world, mouseConstraint);
      clearInterval(intervalId);
      textdiv.textContent = "Success! You completed the level!";
    }
  } else {
    Composite.add(engine.world, mouseConstraint);
    clearInterval(intervalId);
    textdiv.textContent = "Fail, repeat level";
  }
};


function testFunction() {
  // Reset count before starting
  if (intervalId) clearInterval(intervalId);

  count = 5;
    intervalId = setInterval(check, 1000);
 /*else {
    console.log("Fail, repeat level");
  } */
}

// Attach to your button
const textdiv = document.getElementById('text');
const checkoutButton = document.getElementById('check-complete');
checkoutButton.addEventListener('click', () => {
  testFunction();
});

  
});
  const Frank = [LeftLeg, RightLeg, Torso, Head, ground, torsoHeadConstraint, torsoLeftLegConstraint, torsoRightLegConstraint];
     Composite.add(engine.world, Frank);
        const respawnButton = document.getElementById('respawn');
        respawnButton.addEventListener('click', () => {
          Matter.Body.setPosition(LeftLeg, { x: window.innerWidth/2 - 22, y: 540 });
          Matter.Body.setPosition(RightLeg, { x: window.innerWidth/2 + 22, y: 540 });
          Matter.Body.setPosition(Torso, { x: window.innerWidth/2, y: 455 });
          Matter.Body.setPosition(Head, { x: window.innerWidth/2, y: 385 });

        })

       

        
      Render.run(render);
      const runner = Runner.create();
      Runner.run(runner, engine);
});
