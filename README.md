# DolphinAI SOE API

Enhance your language learning with our Pronunciation Assessment API. Tailored to support language learners, our API evaluates pronunciation by analyzing audio files and text strings, providing comprehensive metrics for speech quality and fluency. 

## Pronunciation Assessment API
### H5 SDK

#### 1. Browser Compatibility

| Operating System | Minimum Supported Browser Version |        |         |       |      |     |
| :--------------- | :-------------------------------- | :------ | :------ | :---- | :--- | :-- |
|                  | 360 Browser                       | Chrome  | Firefox | Cheetah | Sogou | QQ  |
| Windows 7        | 8.0.1.222                         | 41.0.2272.76 | 46   | 5.9.109 | 7    | 9.3.1 |
| Windows 10/11    | 8.0.1.222                         | 43.0.2357.81 | 46   | 5.9.109 | 7    | 9.3.1 |
| MAC OS           | No MAC Version                    | 43.0.2357.81 | 46   | No MAC Version | No MAC Version | No MAC Version |

#### 2. Quick Start

1. Download the H5 SDK file locally.
2. Open a terminal window on your computer and install `http-server` to start a local service.
   ```
   npm i -g http-server
   ```
3. Navigate to the `h5 SDK` directory and run `http-server` in the terminal.
4. Access the URL displayed in the terminal through a browser, such as `http://127.0.0.1:8080/index.html`.

> **Note:**
>
> Do not directly run the local files.
> Installing `http-server` is for starting a local service, which depends on the node environment. If node is not installed, npm cannot be used.

#### 3. Inclusion

```html
<!-- Introduce the core recording file -->
<script type="text/javascript" src="static/recorder/recorder.min.js"></script>

<!-- Introduce the SDK core file -->
<script type="text/javascript" src="sdk/soeEngine.min.js"></script>
```

####  4. Parameter Configuration

##### 1. Engine Parameters
Example of parameters:

- Set `appId` and `appSecret`.
  - Contact business personnel to get `appId` and `appSecret`.

- Set evaluation parameters.
  - Refer to the <a href="https://soe.dolphin-ai.jp/help?url=mode/common&id=_2" target="_blank">Common Parameters: Evaluation Parameters</a> document.
  - Set evaluation parameters in the `coreType` field using JSON.
  - Mandatory parameters, if missing or out of range, will return an error code and message in the `engineBackResultError` callback.
  - Optional parameters, if missing, will take default values; if out of range, they will take default values and return an error code and message in the `engineBackResultWarning` callback.

**Example (recommended method): Obtain `signature` from the backend**

For security reasons, it is recommended to keep `appSecret` on the backend and generate `signature` from there.

Construction of `signature`:

1. Use `appId` and `timestamp` request parameters to construct a standardized request string `stringToSign` (note the parameter order), like:

   ```
   appId=XXXX-XXXX-XXXX&timestamp=1234567890
   ```

2. Use the `HMAC-SHA1` signature algorithm to calculate the corresponding digital signature (Base64 encoded). Use the appSecret provided to your company as the key for the signature algorithm.

   ```
   signature = Base64(HMAC-SHA1(stringToSign, appSecret))
   ```

- Use the [HMAC-SHA1 Online Calculation Tool](https://1024tools.com/hmac) to verify if the generated digital signature is correct:

  - Message: Fill in the `stringToSign` constructed in step 1.
  - Algorithm: Choose `SHA1`.
  - Key: Enter your appSecret.
  - Do not check the box below.
  - Click the calculate button, "Result B" is the correct digital signature, if your generated digital signature matches this result, your signature is correct.

- Backend digital signature example code is provided for various programming languages.

- Frontend example code:

   ```javascript
   new ZyEngine ({
       appId: '',
       signature : '',
       timestamp : 1234567890, // Numeric
       domain: '', // Set the service domain. If not set, or set to '', the default domain will be used.
       i18n: '',   // Internationalized error messages: if not provided, the SDK will use the system language (currently only supports the following languages: en, zh)
       coreType : {
           langType : 'en-US', // Language option: English en-US / Chinese zh-cmn-Hans-CN
           format : 'mp3', // Real-time recording does not need to pass this value; when uploading files, pass the audio format, supports mp3, wav, pcm
           sampleRate : 16000, // Audio sample rate (Hz): currently only supports 16000
           looseness : 4, // Scoring leniency, range: 0-9, the higher the value, the more lenient
           connectTimeout : 15, // Connection timeout (seconds range: 5-60)
           responseTimeout : 15, // Response timeout (seconds), range: 5-60
           scale : 100, // Scoring scale, range: 1-100
           ratio : 1, // Scoring adjustment coefficient, range: 0.8-1.5
           userId : '', // The userId entered will be returned in the evaluation result
           audioUrl: true, // Whether to return the audio URL and whether to save the audio
           realtime: false, // Whether to return results in real-time; only supports sentence and chapter question types in English and Chinese, as well as poem and recite question types in Chinese
           maxPrefixSilence: 0, // Threshold for detecting leading silence in speech (in seconds), range 1–30
           maxSuffixSilence: 0, // Threshold for detecting trailing silence in speech (in seconds), range 1–30
           maxPrefixSilenceMs: 0, // Threshold for detecting leading silence in speech (in milliseconds), range [0–30000]
           maxSuffixSilenceMs: 0, // Threshold for detecting trailing silence in speech (in milliseconds), range [0–30000]
           connti: 0, // Enable detection of liaison and elision, default is 0, applicable only to English
           mini: 0, // Default is 0, returns full data; when set to 1, only basic data (total score, fluency, accuracy, completeness, etc.) will be returned
           precision: '0', // Sets the scoring precision, default is 0, supports only 0, 0.1, 0.25, 0.5, 1
       },
   })
   ```

**Example (unsafe method): Place `appSecret` in the frontend, and generate `signature` from there**

- Frontend example code:

   ```javascript
   new ZyEngine ({
       appId: '',
       appSecret : '',
       coreType : {
           langType : 'en-US', // Language option: English en-US / Chinese zh-cmn-Hans-CN
           format : 'mp3', // Real-time recording does not need to pass this value; when uploading files, pass the audio format, supports mp3, wav, pcm
           sampleRate : 16000, // Audio sample rate (Hz): currently only supports 16000
           looseness : 4, // Scoring leniency, range: 0-9, the higher the value, the more lenient
           connectTimeout : 15, // Connection timeout (seconds), range: 5-60
           responseTimeout : 15, // Response timeout (seconds), range: 5-60
           scale : 100, // Scoring scale, range: 1-100
           ratio : 1, // Scoring adjustment coefficient, range: 0.8-1.5
           userId : '', // The userId entered will be returned in the evaluation result
           audioUrl: false, // Whether to return the audio URL and whether to save the audio
           realtime: false, // Whether to return results in real-time; only supports sentence and chapter question types in English and Chinese, as well as poem and recite question types in Chinese
           maxPrefixSilence: 0, // Threshold for detecting leading silence in speech (in seconds), range 1–30
           maxSuffixSilence: 0, // Threshold for detecting trailing silence in speech (in seconds), range 1–30
           maxPrefixSilenceMs: 0, // Threshold for detecting leading silence in speech (in milliseconds), range [0–30000]
           maxSuffixSilenceMs: 0, // Threshold for detecting trailing silence in speech (in milliseconds), range [0–30000]
           connti: 0, // Enable detection of liaison and elision, default is 0, applicable only to English
           mini: 0, // Default is 0, returns full data; when set to 1, only basic data (total score, fluency, accuracy, completeness, etc.) will be returned
           precision: '0', // Sets the scoring precision, default is 0, supports only 0, 0.1, 0.25, 0.5, 1
       },
   })
   ```

##### 2. Microphone Methods

Configuration parameters:

| Name               | Type     | Description                     | Default Value |
| ------------------ | -------- | ------------------------------- | ------------- |
| micAllowCallback   | Function | Microphone permission callback  | None          |
| micForbidCallback  | Function | Microphone denial callback      | None          |
| recorderBlob       | Function | Audio recording Blob data callback | None      |

Parameter example:

```javascript
new ZyEngine ({ 
    micAllowCallback:function(){},
    micForbidCallback:function(msg){},
    recorderBlob:function(blob){},
})
```

##### 3. Initialization Methods

Configuration parameters:

| Name                  | Type     | Description                | Default Value |
| --------------------- | -------- | -------------------------- | ------------- |
| engineFirstInitDone   | Function | Initialization success callback | None        |
| engineFirstInitFail   | Function | Initialization failure callback | None        |

Parameter example:

```javascript
new ZyEngine ({ 
    engineFirstInitDone:function(){},
    engineFirstInitFail:function(status, msg){} 
})
```

##### 4. Engine Evaluation Success

Configuration parameters:

| Name                    | Type     | Description                           | Default Value |
| ----------------------- | -------- | ------------------------------------- | ------------- |
| getRealtimeResult       | Function | Real-time result return callback      | None          |
| engineBackResultDone    | Function | Result success return callback        | None          |
| engineBackResultError   | Function | Result error return callback          | None          |
| engineBackResultWarning | Function | Result warning return callback        | None          |

Parameter example:

```javascript
new ZyEngine ({ 
    getRealtimeResult:function(data){},
    engineBackResultDone:function(data){},
    engineBackResultError:function(status, msg){},
    engineBackResultWarning:function(status, msg){} 
})
```

##### 5. Audio

Configuration parameters:

| Name                 | Type     | Description                        | Default Value |
| -------------------- | -------- | ---------------------------------- | ------------- |
| playAudioComplete    | Function | Audio playback completion callback | None          |
| playAudioError       | Function | Audio loading or playback error callback | None    |

Parameter example:

```javascript
new ZyEngine ({ 
    playAudioComplete:function(){},
    playAudioError:function(){} 
})
```

##### 6. Network

Configuration parameters:

| Name       | Type     | Description         | Default Value |
| ---------- | -------- | ------------------- | ------------- |
| noNetwork  | Function | Network check callback | None        |

Parameter example:

```javascript
new ZyEngine ({ 
    noNetwork:function(){},
})
```

####  5. Method Calls

##### startEvaluation(params, audioFile)

Function: Starts the evaluation.  
Parameter: `@params` - Set the question type parameters, please refer to the corresponding question type's <a href="https://soe.dolphin-ai.jp/help?url=mode/intro" target="_blank">Interface Parameters</a> document.  
Parameter: `@audioFile` - The audio file needed for evaluation.  
Example of `params`:

```json
{
    "mode": "word",
    "refText": "good morning"
}
```

##### startRecord(params)

Function: Starts recording.  
Parameter: `@params` - Set the question type parameters, please refer to the corresponding question type's <a href="https://soe.dolphin-ai.jp/help?url=mode/intro" target="_blank">Interface Parameters</a> document.  
Example:

```json
{
    "mode": "word",
    "refText": "good morning"
}
```

##### stopRecord()

Function: Stops the recording; recording evaluation stops.

##### cancelRecord()

Function: Cancels the recording; call this when the page is destroyed or not visible.

##### loadAudio(url)

Function: Initializes the audio.  
Parameter: `@url` - The audio playback address.

##### playAudio()

Function: Plays the audio.

##### pauseAudio()

Function: Pauses the playback.

##### stopAudio()

Function: Stops the playback.

##### playAudioAgain()

Function: Continues the playback.

##### getDuration()

Function: Gets the duration of the audio.

##### getCurrentTime()

Function: Gets the current playback progress of the audio.

##### destroyEngine()

Function: Destroys the instance.

#### 6. Status Code Table

Please refer to the <a href="https://soe.dolphin-ai.jp/help?url=sdk/status" target="_blank">Status Code</a> document.

#### 7. Common Questions

1. **What is the minimum Android system version supported?**

   Answer: The Android version SDK currently supports version 4.4 and above. React-Native, Flutter, and other cross-platform solutions are not currently supported and need to be encapsulated by the user.

2. **Which application platforms are supported by voice evaluation?**

   Currently, voice evaluation supports Android, iOS, Web, Mini Programs, Linux, Windows, Dictionary Pens, RTOS, and other application platforms.

3. **What audio formats are supported by voice evaluation?**

   For an introduction to audio formats, please view the <a href="https://soe.dolphin-ai.jp/help?url=public/datadict/format" target="_blank">Supported Audio Formats</a> document.

4. **Error codes and related solutions**

   For an introduction to error codes, please view the <a href="https://soe.dolphin-ai.jp/help?url=sdk/status" target="_blank">Status Code</a> document.

5. **What question types, texts, audio duration limits, results, and meanings of each field are supported by voice evaluation?**

   For information on supported question types, text, audio duration limits, please view the <a href="https://soe.dolphin-ai.jp/help?url=mode/intro" target="_blank">Question Types</a> document and the <a href="https://soe.dolphin-ai.jp/help?url=mode/common" target="_blank"> Parameter Introduction</a>document.

6. **Why is there no audio URL in the return results, or why is the audioUrl address empty?**

   If it is online evaluation, you need to pass audioUrl=true before the evaluation; then, the results will return the audioUrl audio address. For offline evaluation, regardless of whether audioUrl is true or false, the audio URL will not be returned.

7. **How long is the evaluation audio address stored?**

   By default, it is retained for **30** days. If longer storage is needed, it is recommended to download it to your own server.
