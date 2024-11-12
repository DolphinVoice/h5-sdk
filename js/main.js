const appId = '';

// 方法1
const signature = '';
const timestamp = '';

// 方法2（非推奨）
const appSecret = '';

let zy = new ZyEngine({
    appId: appId,
    appSecret : appSecret,
    domain: '',
    i18n: '',
    // signature : signature,
    // timestamp : timestamp,
    // 初期化パラメータ
    coreType : {
        langType : 'en-US', // 言語オプション：英語 en-US
        format : 'mp3', // リアルタイム録音時は値を渡す必要なし；ファイルアップロード時は音声フォーマットを渡す、mp3、wav、pcmをサポート
        sampleRate : 16000, // 音声サンプリングレート（Hz）：現在16000のみサポート
        looseness : 4, // スコアの寛容度、範囲：0-9、数値が大きいほど寛容
        connectTimeout : 15, // 接続タイムアウト時間（秒）、範囲：5-60
        responseTimeout : 15, // レスポンスタイムアウト時間（秒）、範囲：5-60
        scale : 100, // スコアの満点、範囲：1-100
        ratio : 1, // スコア調整係数、範囲：0.8-1.5
        userId : '', // 渡されたuserIdは評価結果で返される
        realtime: false, // リアルタイムで結果を返すかどうか；中国語と英語のsentence、chapter問題タイプ、中国語のpoem、recite問題タイプのみサポート
        audioUrl: true,
    },
    params : {
        mode : "", // 評価モード：基本問題タイプ word/sentence/chapter  高度問題タイプ qa/topic/retell
        // 基本問題タイプ（単語、文、段落）
        refText : "", // 評価対象の読み上げテキスト：
        // 高度問題タイプ（質問回答）
        stem : { // 問題文
            para: "", // 段落内容
            question: "", // 質問内容
        },
        distractor : [],
        // 高度問題タイプ（質問回答）&& 高度問題タイプ（画像説明/口頭作文）&& 高度問題タイプ（要約）
        answer : [],
        keyword : [],
    },
    micAllowCallback: function() {
        console.log('=====マイクが許可されました=====');
    },
    micForbidCallback: function(msg) {
        console.error('====='+msg+'=====');
        alert(msg)
    },
    engineFirstInitDone:function(){
        console.log('=====初期化成功=====');
    },
    engineFirstInitFail:function(status,msg){
        console.error('====='+status+':'+msg+'=====');
        alert(status+':'+msg)
    },
    getRealtimeResult:function(msg){
        console.log(msg);
        myRecordResult(msg);
    },
    engineBackResultDone:function(msg){
        console.log(msg);
        myRecordResult(msg);
    },
    engineBackResultWarning:function(status,msg){
        console.warn('評価警告');
        console.warn('====='+status+':'+msg+'=====');
        $('.errorBox').html(`警告情報：<span>`+status+':'+msg+`</span>`)
        $('.errorBox').css('display','block')
        // alert(status+':'+msg)
        $("#linkSocket").removeAttr('disabled')
        $("#wsStop").attr('disabled','disabled')
    },
    engineBackResultError:function(status,msg){
        console.error('評価失敗');
        console.error('====='+status+':'+msg+'=====');
        $('.errorBox').html(`エラー情報：<span>`+status+':'+msg+`</span>`)
        $('.errorBox').css('display','block')
        // alert(status+':'+msg)
        $("#linkSocket").removeAttr('disabled')
        $("#wsStop").attr('disabled','disabled')
    },
    playAudioComplete: function() {
        console.log('再生完了');
    },
    playAudioError:function(){
        console.error('再生エラー');
        alert('再生エラー')
    },
    micVolumeCallback: function(data) {
        console.log('録音音量：' + data);
    },
    noNetwork: function() {
        console.warn('ネットワークなし');
        alert('ネットワークなし')
    },
    recorderBlob: function(blob) {
        console.log(blob)
    },
});

$(document).ready(()=>{
    let paused = false;
    $("#startHTTP").bind("click", function() {
        let files = document.getElementById('file').files;
        let file = files[0]
        // if(zy.coreType.langType=='en-US') {
        //     zy.params.mode = getCoreType();
        // }
        // else if(zy.coreType.langType=='zh-cmn-Hans-CN'){
        //     zy.params.mode = getCoreType_Chn();
        // }
        zy.params.mode = getCoreType();
        zy.params.refText = getEvalText();
        let params = zy.params;
        if (params.refText !== '') {
            zy.startEvaluation(params,file);
            $("#score").text('評価中...');
        } else {
            alert('評価内容を入力してください');
        }
    })
    $("#linkSocket").bind("click", function() {
        recordInit();
       // if(document.getElementById('appid').value =='') {
            ////alert('appIdを入力してください');
           // //return;
       // }
       // if(document.getElementById('appsecret').value =='') {
           // //alert('appSecretを入力してください');
           // //return;
       // }
       //  if(zy.coreType.langType=='en-US') {
       //      zy.params.mode = getCoreType();
       //  }
       //  else if(zy.coreType.langType=='zh-cmn-Hans-CN'){
       //      zy.params.mode = getCoreType_Chn();
       //  }
        zy.params.mode = getCoreType();
        zy.params.refText = getEvalText();
        let params = zy.params;
        if (params.refText !== '') {
            zy.startRecord(params);
            $("#score").text('録音中...');
            $("#linkSocket").attr('disabled','disabled')
            $("#wsStop").removeAttr('disabled')
        } else {
            alert('評価内容を入力してください');
        }
    });
    // 録音停止
    $("#wsStop").bind("click", function(){
        $("#score").text('評価中...');
        zy.stopRecord();
    });
    // 音楽再生イベント
    $('#play').on('click', function() {
        paused = false;
        $('#pause').find('span').text('一時停止');
        zy.loadAudio(musicUrl);
        zy.playAudio();
    });
    // 音楽再生一時停止
    $('#pause').on('click', function() {
        if (!paused) {
            paused = true;
            $(this).find('span').text('再開');
            zy.pauseAudio();
            console.log(zy.getCurrenttime())
        } else {
            paused = false;
            $(this).find('span').text('一時停止');
            zy.playAudioAgain();
        }
    });
    $('#stop').on('click', function() {
        console.log(zy.getDuration())
        zy.stopAudio();
    });
})
// 録音結果詳細等の初期化メソッド
function recordInit(){
    $("#point").text('');
    $("#totalPoint").text('');
    $("#result").val('');
    $('#audioUrl').text('');
    $('#grade').html('');
}
// 評価タイプの取得 - 英語
function getCoreType(){
    return $('#coreType').find('input[name="coreType"]:checked').val();
}
// 評価タイプの取得 - 中国語
function getCoreType_Chn(){
    return $('#coreType_Chn').find('input[name="coreType_Chn"]:checked').val();
}
// 評価テキストの取得
function getEvalText() {
    return $.trim($('#eng-txt').val());
}
let musicUrl;
// 評価データの結果分析の取得
let myRecordResult = function(result) {
    let recordResult = result;
    let gradeInfo = '';
    let mode = getCoreType();
    // let mode='';
    // if(zy.coreType.langType=='en-US') {
    //     mode = getCoreType();
    // }
    // else if(zy.coreType.langType=='zh-cmn-Hans-CN'){
    //     mode = getCoreType_Chn();
    // }
    $("#point").text(recordResult.overall.toFixed(0));
    $("#totalPoint").text(recordResult.params.request.scale);
    $('#audioUrl').text(recordResult.audioUrl);
    $("#result").val(JSON.stringify(recordResult));
    musicUrl = recordResult.audioUrl
    let wordPoint = recordResult.wordInfo;
    let sentencePoint = recordResult.sentenceInfo;
    if (mode == "phoneme") {
        gradeInfo = wordLevel(recordResult.overall, recordResult.refText);
    } else if (mode == "word" || mode == "sentence") {
        wordPoint.forEach(function(item) {
            gradeInfo += wordLevel(item.score, item.refText);
        })
    } else if (mode == "chapter"){
        sentencePoint.forEach(function(item,index) {
            sentencePoint[index].wordInfo.forEach(function(item) {
                gradeInfo += wordLevel(item.score, item.refText);
            })
        })
    } else {
        wordPoint.forEach(function(item) {
            gradeInfo += wordLevel(item.score, item.refText);
        })
    }
    $('#grade').html(gradeInfo);
    $("#score").text('評価完了');
    $("#linkSocket").removeAttr('disabled')
    $("#wsStop").attr('disabled','disabled')
}
let wordLevel = function(point, word){
    let mode = getCoreType();
    // let mode='';
    // if(zy.coreType.langType=='en-US') {
    //     mode = getCoreType();
    // }
    // else if(zy.coreType.langType=='zh-cmn-Hans-CN'){
    //     mode = getCoreType_Chn();
    // }
    let exce = 90;
    let good = 75;
    let fine = 60;
    let exceColor = '<span style="color: #00EC00">';
    let goodColor = '<span style="color: #00E3EE">';
    let fineColor = '<span style="color: #5B5B5B">';
    let badColor = '<span style="color: #FF5151">';
    let level
    if(mode == "word" || mode == "sentence" || mode == "chapter"){
        if (point >= exce){
            level = ' ' + exceColor + word +'</span>';
        } else if(good <= point && point < exce){
            level = ' ' + goodColor + word +'</span>';
        } else if(fine <= point && point < good){
            level = ' ' + fineColor + word +'</span>';
        } else{
            level = ' ' + badColor + word +'</span>';
        }
    }else{
        if (point >= exce){
            level = exceColor + word +'</font>';
        } else if(good <= point && point < exce){
            level = goodColor + word +'</font>';
        } else if(fine <= point && point < good){
            level = fineColor + word +'</font>';
        } else{
            level = badColor + word +'</font>';
        }
    }
    return level;
}
$("#coreLanguages").change(function () {
    if ($(this).val() == 0) {
        zy.appId=document.getElementById('appid').value
        zy.appSecret=document.getElementById('appsecret').value
        zy.coreType.langType='en-US'
        $("#coreType").css('display','inline-block')
        $("#coreType_Chn").css('display','none')
        document.getElementById("rphoneme").checked=true
        $("#eng-txt").val('aa');
    } else if ($(this).val() == 1) {
        zy.appId=document.getElementById('appid').value
        zy.appSecret=document.getElementById('appsecret').value
        zy.coreType.langType='zh-cmn-Hans-CN'
        $("#coreType_Chn").css('display','inline-block')
        $("#coreType").css('display','none')
        document.getElementById("rphoneme_Chn").checked=true
        $("#eng-txt").val('a');
    }
})

$("input[name='coreMode']").change(function () {
    if ($(this).val() == 0) {
        $('.noFile').css('display','inline-block')
        $('.filesBox').css('display','none')
    } else if ($(this).val() == 1) {
        $('.filesBox').css('display','inline-block')
        $('.noFile').css('display','none')
    }
})
// 英語
$("input[name='coreType']").each(function () {
     if ($(this).is(":checked")) {
        $("#eng-txt").val('aa');
    }
})
$("#rphoneme").change(function(){
	$("#eng-txt").val('aa');
})
$("#rword").change(function(){
	$("#eng-txt").val('hello everyone');
})
$("#rsentence").change(function(){
	$("#eng-txt").val('Nice to meet you.');
})
$("#rchapter").change(function(){
    var str = `In the morning, I'm going to the bookstore. I'm not going to buy any books. I'm going to buy some pens and rulers. Then I'm going to the supermarket with my mother. We are going to buy a lot of things. In the afternoon, I'm going to do my homework first. Then I'm going to visit my grandparents. We are going to talk and watch TV together. I'm going to have a big dinner with them. After that, we are going to take a walk in the park.`;
	$("#eng-txt").val(str);
})

// 中国語
$("#rphoneme_Chn").change(function(){
   $("#eng-txt").val('a');
})
$("#rword_Chn").change(function(){
   $("#eng-txt").val('你好');
})
$("#rsentence_Chn").change(function(){
   $("#eng-txt").val('今天的天气真好。');
})
$("#rchapter_Chn").change(function(){
   var str = `盼望着，盼望着，东风来了，春天的脚步近了。一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。`;
   $("#eng-txt").val(str);
})