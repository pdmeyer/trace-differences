import com.leapmotion.leap.*;

import java.util.Arrays;
import java.lang.Math;

import oscP5.*;
import netP5.*;

String destinationIpAddress = "127.0.0.1";
int destinationPort = 6450;
int listenPort = 9000;
String oscSendValuePrefix = "/gest/val";
String oscSendKeyPrefix = "/gest/attr";
int numFeatures = 18;

/* normalization variables */
//float rollAbsoluteRange = 50.0;  // right: positive < .5; negative > .5
float rRollMin = -110.0;
float rRollMax = 45.0;
float lRollMin = -35.0;
float lRollMax = 135.0;
float pitchMin = -20.0;
float pitchMax = 35.0;
float radiusMin = 34.0;
float radiusMax = 100.0;
float yawMin = -40.0;
float yawMax = 25.0;
float xMin = -120.0;
float xMax = 120.0;
float yMin = 70.0;
float yMax = 420.0;
float zMin = -120.0;
float zMax = 120.0;


String[] handNames = {"left", "right"};
String metrics[] = {"_x", "_y", "_z", "_roll", "_pitch", "_yaw", "_grab", "_pinch", 
                    "_radius"};

int messageSendRate = 3;   /* rate is 1 / messageSendRate */
int handsFound = 0;
int count = 0;

OscP5 oscP5;
NetAddress destination;
Controller leap;
Listener listener;
Frame currentFrame;


float[] features = new float[numFeatures];

void setup() {
  
  size(275, 100);
  text("Rasta have the handle", 50., 50.);

  /* 
  start oscP5, listening for incoming messages at port 9000
  send to localhost, port 6448
  */
  oscP5 = new OscP5(this, listenPort);
  destination = new NetAddress(destinationIpAddress, destinationPort);
    
  leap = new Controller();
  
  listener = new Listener() {
      public void onInit(Controller controller) {
          dispatch("leapOnInit");
      }

      public void onConnect(Controller controller) {
          dispatch("leapOnConnect");
      }

      public void onDisconnect(Controller controller) {
          dispatch("leapOnDisconnect");
      }

      public void onExit(Controller controller) {
          dispatch("leapOnExit");
      }

      public void onFrame(Controller controller) {
          currentFrame = controller.frame();
          dispatch("leapOnFrame");
      }
  };
 
  leap.addListener(listener);

  leap.setPolicy(com.leapmotion.leap.Controller.PolicyFlag.POLICY_BACKGROUND_FRAMES);

  sendInputNames();
  
  println("[INFO] Setup complete...");
 
}

private void dispatch(final String method) {
    boolean success = false;
    try {
        this.getClass().getMethod(
                method
        ).invoke(
                this
        );
        success = true;
    } catch (Exception e) {
        // e.printStackTrace();
    } finally {       
        if (success) {
            println(String.format("Callback %s();", method));
        }
    }
}

float normalizeValue(float raw, float min, float max) {
  
  if (raw < min) {
    raw = min;
  } else if (raw > max) {
    raw = max;
  }

  return (raw - min) / (max - min);
}

float normalizeAngle(float angle, float absoluteRange, float sign) {

  angle = angle * sign;
  float value = 0.0;

  if (abs(angle) < absoluteRange) {
    value = absoluteRange + angle;
  } else if (abs(angle) >= absoluteRange) {
    if (angle < 1)
      return 0.0;
    else 
      value = absoluteRange * 2.0;
  }

  return value / (absoluteRange * 2.0);

}

void draw() {
  
  Frame frame = leap.frame();
  float fps = frame.currentFramesPerSecond();
  
  // println("[INFO] Current fps: " + String.valueOf(fps));
  
  handsFound = 0;

  for (Hand hand : frame.hands()) {
    
    handsFound++;
    
    Vector position = hand.palmPosition();
    Vector direction = hand.direction();
    Vector normal = hand.palmNormal();
    float x = normalizeValue(position.getX(), xMin, xMax);
    float y = normalizeValue(position.getY(), yMin, yMax);
    float z = normalizeValue(position.getZ(), zMin, zMax);
    float grab = hand.grabStrength();
    float pinch = hand.pinchStrength();
    float radius = hand.sphereRadius(); //millimeters

    float xRaw = position.getX();
    float yRaw = position.getY();
    float zRaw = position.getZ();
    float rollRaw = normal.roll() * RAD_TO_DEG;
    float pitchRaw = direction.pitch() * RAD_TO_DEG;
    float yawRaw = direction.yaw() * RAD_TO_DEG;
    float grabRaw = hand.grabStrength();
    float pinchRaw = hand.pinchStrength();
    float radiusRaw = hand.sphereRadius(); //millimeters
    
    if (hand.isLeft()){
      
      features [0] = x;
      features [1] = y;
      features [2] = z;
      features [3] = Math.abs(1 - normalizeValue(rollRaw, lRollMin, lRollMax));
      features [4] = normalizeValue(pitchRaw, pitchMin, pitchMax);
      features [5] = normalizeValue(yawRaw, yawMin, yawMax);
      features [6] = grab;
      features [7] = pinch;
      features [8] = normalizeValue(radius, radiusMin, radiusMax);

      //features [18] = xRaw;
      //features [19] = yRaw;
      //features [20] = zRaw;
      //features [21] = rollRaw;
      //features [22] = pitchRaw;
      //features [23] = yawRaw;
      //features [24] = grabRaw;
      //features [25] = pinchRaw;
      //features [26] = radiusRaw;

    } else if (hand.isRight()) {
      
      // println("[INFO] Right hand found.");
       
      features [9]  = x;
      features [10] = y;
      features [11] = z;
      features [12] = Math.abs(1 - normalizeValue(rollRaw, rRollMin, rRollMax));
      features [13] = normalizeValue(pitchRaw, pitchMin, pitchMax);
      features [14] = normalizeValue(yawRaw, yawMin, yawMax);
      features [15] = grab;
      features [16] = pinch;
      features [17] = normalizeValue(radius, radiusMin, radiusMax);

      //features [27] = xRaw;
      //features [28] = yRaw;
      //features [29] = zRaw;
      //features [30] = rollRaw;
      //features [31] = pitchRaw;
      //features [32] = yawRaw;
      //features [33] = grabRaw;
      //features [34] = pinchRaw;
      //features [35] = radiusRaw;
      
    }
    
  }
  
  if (count % messageSendRate == 0) {  
    sendOsc(oscSendValuePrefix, features);
  }

  count++;
 
}


//====== OSC SEND ======
void sendOsc(String messagePrefix, float[] features) {
  OscMessage msg = new OscMessage(messagePrefix);
  println("hands found = " + handsFound);
  if (handsFound > 0) {
    for (int i = 0; i < features.length; i++) {
      msg.add(features[i]);
    }
    oscP5.send(msg, destination);
    // println("[INFO] OSC features: " + Arrays.toString(features));
    // println("[INFO] Sent OSC: " + msg.toString());

  } else {
    
    //println("[INFO] No hands found.");
    
  }
  
}

void sendInputNames() {
   OscMessage msg = new OscMessage(oscSendKeyPrefix);
   for (int i = 0; i < handNames.length; i++) {
     for (int j = 0; j< metrics.length; j++) {
        msg.add(handNames[i] + metrics[j]); 
     }
   }

   oscP5.send(msg, destination);   
   
   println("[INFO] Sent OSC: " + msg.toString());
   
   println("[INFO] Input configuration sent to: " + destinationIpAddress + ":" + 
     String.valueOf(destinationPort));
   println("[INFO] Hand names: " + handNames.toString());
   println("[INFO] With metrics: " + metrics.toString());
}
