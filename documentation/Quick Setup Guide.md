# Foreword
This guide is meant to retrace the steps taken to get the project working in a Windows developement environment. All the steps listed in this document might not be completely necessary. However, I'd suggest following them if you're not familiar with the tools used.

# Step 1: Install Java

The first step is to install Java jdk 1.8. However, this is not the only step. First, make sure the "bin" folder inside your java installation is listed in your system PATH. If you have previous installations of Java, make sure the 1.8 path is listed above the other Java paths. 

You will also need to set the JAVA_HOME environment variable to the installation folder of Java 1.8.

To make sure eveythting is installed correctly, open a command prompt and type the command ``` java -version ```. If your installation is correct, the output of this command should indicate that Java 1.8 is installed.


# Step 2: Install Android studio
You will need to install Android Studio. You can get it at their website here: https://developer.android.com/studio.

Once android studio is installed, you will have to launch it, navigate to the settings and make sure they correspond to this:

![](media/android_studio_options.png)

Once the installation is complete, add these to your path variables:
``` bash
%USERPROFILE%\AppData\Local\Android\Sdk\platforms
%USERPROFILE%\AppData\Local\Android\Sdk\platform-tools
%USERPROFILE%\AppData\Local\Android\Sdk
%USERPROFILE%\AppData\Local\Android\Sdk\tools\bin
```

# Step 3: Install Node js and npm
If you haven't already, install Node Js from here: https://nodejs.org/en/download/

# Step 4: Install Gradle
Download and install Gradle from here: https://gradle.org/install/

Follow the instructions under "Installing manually".

# Step 5: Installing global NPM packages
In a command prompt, run the following commands to install vue js tools and cordova:
``` bash
npm install -g cordova
npm install -g vue-cli
```

# Step 6: Import the project and install dependencies
After importing the project through git, navigate to the folder in which the project is situated and run the command
``` bash
npm install
```

After all this, you should be good to go. To start and build the project, you can follow the instrtuctions in the main README file.

# Sources used to initiate the setup
https://blog.theodo.com/2019/11/integrate-typescript-with-vue/
https://medium.com/@valeriocapogna/how-to-setup-a-cordova-app-using-vue-js-8ba1315b9666
https://blog.pusher.com/how-to-build-an-android-app-using-cordova-and-vue-js/