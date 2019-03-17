app.controller('roomCtrl', function ($scope, $routeParams, $interval, socket) {
    $scope.playlist = []
    $scope.playlistIndex = 0;
    $scope.roomName = "";
    $scope.newVideo = "";
    $scope.isMaster = false;
    $scope.connectedClients = 0;

    $scope.roomId = $routeParams.id;

    $scope.custom = {
        url: '',
        player: null,
        vars: {
            controls: 0,
            autoplay: 0
        }
    };

    socket.on('connect', function () {
        socket.emit("joinroom", $scope.roomId);
    });

    socket.on('play', function () {
        console.log("recieving play event")
        $scope.custom.player.playVideo();
    });

    socket.on('numClients', function (numClients) {
        console.log("receiving numClients", numClients);
        $scope.connectedClients = numClients;
    });

    socket.on('roomData', function (roomData) {
        console.log("receiving roomData", roomData);
        $scope.roomName = roomData.roomName;
        $scope.playlist = roomData.playlist
        $scope.playlistIndex = roomData.playlistIndex;
        $scope.custom.url = $scope.playlist[$scope.playlistIndex]
    });

    socket.on('paus', function () {
        console.log("recieving pause event")
        $scope.custom.player.pauseVideo();
    });

    socket.on('master', function () {
        console.log("you are the master client");
        $scope.isMaster = true;
    });

    socket.on('disconnect', function () {
        if ($scope.isMaster) {
            socket.emit("masterStop");
        }
    });

    $scope.addToPlayList = function (url) {
        let obj = { id: $scope.roomId, url: url }
        console.log(obj);
        socket.emit('addtoPlaylist', obj);
        console.log("New Video added");

        $scope.newVideo = "";
    };

    $scope.$on('youtube.player.playing', function ($event, player) {
        console.log("sending play event");
        socket.emit("play", $scope.roomId);
    });

    $scope.$on('youtube.player.paused', function ($event, player) {
        console.log("sending pause event");
        socket.emit("paus", $scope.roomId);
    });

    $scope.$on('youtube.player.buffering', function ($event, player) {
        console.log("Buffering");
    });

    $scope.$on('youtube.player.ended', function ($event, player) {
        console.log("Slut");
        if ($scope.playlistIndex === $scope.playlist.length - 1) {
            $scope.playlistIndex = 0;
        }
        else {
            $scope.playlistIndex++;
        }
        $scope.custom.url = $scope.playlist[$scope.playlistIndex];
    });

});