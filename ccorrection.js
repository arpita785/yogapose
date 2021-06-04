let video;
//let keys = JSON.parse(cpose);
let poseNet;
let pose;
let skeleton;

let brain;

let poseLabel;
let instr = '';
let instr1 = '';
let instr2 = '';
let instr3 = '';
let instr4 = '';
let instr5 = '';
var msg = new SpeechSynthesisUtterance();

function setup() {
  var cnvs = createCanvas(640, 480);
  cnvs.style('margin-top', '150px');
  cnvs.style('margin-left', '330px');
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, posenetLoaded);
  poseNet.on('pose', gotPoses);
  
  let options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
      model: 'model - 150.json',
      metadata: 'model_meta - 150.json',
      weights: 'model.weights - 150.bin'
  };
  brain.load(modelInfo, modelLoaded);
}

function posenetLoaded() {
    console.log('poseNet ready');
}

function modelLoaded() {
    console.log('model ready!');
    classifyPose();
}

function classifyPose() {
    if (pose) 
    {
        let inputs = [];
        for(let i = 0; i < pose.keypoints.length; i++)
        {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResult);
        correct();
    }
    else
    {
        setTimeout(classifyPose, 100);
    }
}

function gotResult(error, results) {
    console.log(results);
    console.log(results[0].label);
    if(results[0].label == 'm')
    {
        poseLabel = 'Mountain pose';
        instr = '';
    }
    else
    {
        poseLabel = 'Chair pose';
        instr = '';
    }
    console.log('running the model again...')
    setTimeout(classifyPose, 7000);
}

function correct() {
    if (pose)
    {
        eyeRX = pose.rightEye.x;
        eyeRY = pose.rightEye.y;
        shoulderRX = pose.rightShoulder.x;
        shoulderRY = pose.rightShoulder.y;
        shoulderLX = pose.leftShoulder.x;
        shoulderLY = pose.leftShoulder.y;
        elbowRX = pose.rightElbow.x;
        elbowRY = pose.rightElbow.y;
        elbowLX = pose.leftElbow.x;
        elbowLY = pose.leftElbow.y;
        wristRX = pose.rightWrist.x;
        wristRY = pose.rightWrist.y;
        wristLX = pose.leftWrist.x;
        wristLY = pose.leftWrist.y;
        hipRX = pose.rightHip.x;
        hipRY = pose.rightHip.y;
        hipLX = pose.leftHip.x;
        hipLY = pose.leftHip.y;
        kneeRX = pose.rightKnee.x;
        kneeRY = pose.rightKnee.y;
        kneeLX = pose.leftKnee.x;
        kneeLY = pose.leftKnee.y;
        ankleRX = pose.rightAnkle.x;
        ankleRY = pose.rightAnkle.y;
        ankleLX = pose.leftAnkle.x;
        ankleLY = pose.leftAnkle.y;
        
        var correct = true;
        
        if(eyeRY < 60.0)
        {
            instr1 = 'Bend more';
            msg.text = "Bend your knees more.";
            window.speechSynthesis.speak(msg);
            correct = false;
            
        }
        else
        {
            instr1 = '';
            msg.text = '';
        }
        
        if(wristRY >= 200.0 && wristLY >= 200.0)
        {
            instr2 = 'do namaste';
            msg.text = "Do the namaste gesture.";
            window.speechSynthesis.speak(msg);
            correct = false;
        }
        else
        {
            msg.text = '';
            instr2 = '';
        }
        
        
        if(ankleRY < 400.0)
        {
            instr4 = 'keep your right leg down';
            msg.text = "Keep your right leg down";
            window.speechSynthesis.speak(msg);
            correct = false;
        }
        else
        {
            instr4 = '';
            msg.text = '';
        }
        
        if(ankleLY < 400.0)
        {
            instr5 = 'keep your left leg down';
            msg.text = "Keep your left leg down.";
            window.speechSynthesis.speak(msg);
            correct = false;
        }
        else
        {
            instr5 = '';
            msg.text = '';
        }
        
        if(correct == true)
        {
            msg.text = "Perfect!";
            window.speechSynthesis.speak(msg);
        }
        
        
    }
    else
    {
        setTimeout(correct(), 7000);
    }
    
    
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw()
{
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);
    
    if(pose)
    {
        for(let i = 0; i < pose.keypoints.length; i++)
        {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0, 255, 0);
            ellipse(x, y, 16, 16);
        }
        
        for(let i = 0; i < skeleton.length; i++)
        {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    }
    
    /*
    strokeWeight(2);
    stroke(170);
    line(0, 50, 640, 50);
    line(0, 100, 640, 100);
    line(0, 150, 640, 150);
    line(0, 200, 640, 200);
    line(0, 250, 640, 250);
    line(0, 300, 640, 300);
    line(0, 350, 640, 350);
    line(0, 400, 640, 400);
    line(0, 450, 640, 450);
    */
    
    pop();

    fill(0, 0, 0);  
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT);
    //text(poseLabel, 50, 30);
    text(instr1, 20, 30);
    
    fill(0, 0, 0);  
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT);
    text(instr4, 20, 50);
    
    fill(0, 0, 0);  
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT);
    text(instr5, 20, 70); 
    
    fill(0, 0, 0);  
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT);
    text(instr2, 20, 90); 
    
    
    if(instr1 == '' && instr2 == '' && instr4  == '' && instr5 == '')
    {
        instr = 'Perfect!';
        
    }
    
    fill(0, 0, 0);  
    noStroke();
    textStyle(BOLD);
    textSize(20);
    textAlign(LEFT);
    text(instr, 20, 30); 
}
