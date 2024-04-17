import { MediaStreamTrack, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, MediaStream, mediaDevices } from "react-native-webrtc";
import io, { Socket } from "socket.io-client";
import { SOCKET_SERVER_URL } from "../constants";
import { EventEmitter } from "eventemitter3";

export class ConnectionService extends EventEmitter {

    public peerConnection: RTCPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
            urls: 'stun:stun.l.google.com:19302',
            },
            {
            urls: 'stun:stun1.l.google.com:19302',
            },
            {
            urls: 'stun:stun2.l.google.com:19302',
            },
        ],
    });
    public socket: Socket;
    public incomingOffer:any;
    public remoteRTCMessage: any;
    public otherSocketId: string; // Socket ID
    public localStream: MediaStream;
    public remoteStream: MediaStream;
    public currentUserId: string;
    public remoteUserId: string; // User ID
    isConnected: boolean = false;

    constructor() {
        super();
    }

    public init() {
        this.socket = io(SOCKET_SERVER_URL);
        this.registerPeerConnectionEvents();
        this.registerSocketEvents();
    }

    public async setConnectionTracks(tracks: MediaStreamTrack[]) {
        tracks.forEach(track => {
            if(!this.peerConnection._trackExists(track)) {
                this.peerConnection.addTrack(track);
            }
        })
    }

    public async registerSocketEvents() {
        this.socket.on('newCall', (offer) => {
            try {
                
                this.remoteUserId = offer.senderUserId;
                this.incomingOffer = offer; // Receive the remote description (answer) from the remote peer.
                this.remoteRTCMessage = offer.offer;
                this.otherSocketId = offer.senderId;
    
                // Open incoming Call model
                this.emit('newCall', {remoteUserId:this.remoteUserId, recipientName: offer.recipientName})
            } catch (error) {
                console.log('\n\n====\n\nnewCall ERROR: \n\n', error, '\n\n=====\n\n');
                
            }
        });
      
        this.socket.on('callAnswered', (answer) => {
            this.remoteRTCMessage = answer.answer;
            console.log('\n\nANSWER', answer.answer, '\n\nEND\n\n');

            this.peerConnection.setRemoteDescription(answer.answer).then(() => {
                this.emit('callAnswered');
            }).catch(error => console.error('Error setting remote description: callAnswered', error)); // Set remote description using setRemoteDescription.

        });

        this.socket.on('add-ice-candidate', (candidate) => {
            console.log(candidate.candidate, 'CANDIDATE');
            // this.peerConnection.addIceCandidate(candidate.candidate);
            
            this.peerConnection.addIceCandidate(new RTCIceCandidate({
                candidate: candidate.candidate.candidate,
                sdpMid: candidate.candidate.sdpMid,
                sdpMLineIndex: candidate.candidate.sdpMLineIndex,
            }));
        });

        this.socket.on('callCancelled', async () => {
            this.peerConnection.close()
            
            this.emit('callCancelled')
        })

        this.socket.on('callRejected', async () => {
            this.peerConnection.close()
            
            this.emit('callRejected')
        })

        this.socket.on('callEnded', async () => {
            this.peerConnection.close()
            
            this.remoteRTCMessage = undefined;
            this.incomingOffer = undefined;
            this.otherSocketId = undefined;
            this.remoteUserId = undefined;
            
            this.emit('callEnded')
        })
    }

    public async registerPeerConnectionEvents() {
      
        this.peerConnection.addEventListener('track', (e) => {
            const newTrack = e.track;
            newTrack.enabled = true;
            if(!this.remoteStream) {
                this.remoteStream = new MediaStream();
                this.remoteStream.addTrack(newTrack);
            } else {
                this.remoteStream.addTrack(newTrack);
            }
        });
          
        this.peerConnection.addEventListener('icecandidate', (e) => {
            
            if(e.candidate !== null) {
                this.socket.emit('ice-candidate', { recipientId: this.getRemoteUserId(), candidate: e.candidate })
            }
        })
    }

    public async setRemoteUserId(remoteUserId: string) {
        this.remoteUserId = remoteUserId;
    }

    public async setCurrentUserId(userId: string) {
        this.currentUserId = userId;
    }

    public async initializeMediaStream() {
        const constraints = {
          audio: true,
          video: {
            facingMode: 'user'
          },
        }
        const stream = await mediaDevices.getUserMedia(constraints)
        this.localStream = stream;
        this.localStream.getTracks().forEach(track => {
            if(!this.peerConnection._trackExists(track)) {
                this.peerConnection.addTrack(track);
            }
        });

        // await this.setConnectionTracks(this.localStream.getTracks());
        await this.registerSocketEvents();
    };

    public async call(remoteUser) {
        try {
            
            this.remoteUserId = remoteUser.id.id.toString();
            if(!this.localStream) {
                await this.initializeMediaStream();
            }
            const offer = await this.peerConnection.createOffer(null); // Create local description (offer) using createOffer.
            console.log('\n\n==========\nCreated Offer: \n\n', offer, '\n\n==========\n\n ');
    
            
            this.peerConnection.setLocalDescription(offer).then(() => {
    
                const recipientName = `${remoteUser.id.title} ${remoteUser.id.firstName} ${remoteUser.id.lastName}`;
                this.socket.emit('offer', { recipientId: remoteUser.id.id.toString(), recipientName, offer }); // Transmit the local description to the remote peer.
            }).catch(error => console.error('Error setting local description: call', error)); // Set local description using setLocalDescription.
        
            return this.localStream;
        } catch (error) {
            console.log('\n\n====\n\nCall ERROR: \n\n', error, '\n\n=====\n\n');

            
        }
    }

    public async acceptCall() {
        try {
            
            if(!this.localStream) {
                await this.initializeMediaStream();
            }
            if(this.incomingOffer) {
                try {
                    await this.peerConnection.setRemoteDescription(this.incomingOffer.offer).catch(error => console.error('Error setting remote description: acceptCall', error)); // Accept call
                    const answer = await this.peerConnection.createAnswer();
                    console.log('\n\n==========\nCreated ANSWER: \n\n', answer, '\n\n==========\n\n ');
                    
                    this.peerConnection.setLocalDescription(answer).then(() => {
                        this.socket.emit('answer', { senderId: this.remoteUserId, answer }); // Emit accept call
                    }).catch(error => console.error('Error setting local description: acceptCall', error));
                } catch (error) {
                    console.error('Error handling accept call:', error);
                }
            } else {
                console.warn('User is not online');
            }
        } catch (error) {
            console.log('\n\n====\n\nACCEPT CALL ERROR: \n\n', error, '\n\n=====\n\n');
            
        }
    }

    public getRemoteUserId(): string {
        return this.remoteUserId;
    }

    public async setLocalStream(stream: MediaStream) {
        this.localStream = stream
    }

    public async setRemoteStream(stream: MediaStream) {
        this.remoteStream = stream
    }

    public async rejectCall() {
        this.socket.emit('reject', { recipientId: this.remoteUserId });
        this.peerConnection.close()
        
        this.incomingOffer = undefined;
    }

    public async connectUser(userId: string) {
        this.currentUserId = userId;
        this.socket.emit('user-connect', userId);
        this.isConnected = true;
    }

    public async cancelCall() {
        this.socket.emit('cancelCall', { recipientId: this.remoteUserId });
        this.peerConnection.close()
        
    }

    public async closeConnection() {
        this.localStream.getTracks().forEach(track => {
            track.stop();
        });
        this.peerConnection.close()
    }
    

    public async disconnectSocket() {
        this.remoteRTCMessage = undefined;
        this.incomingOffer = undefined;
        this.otherSocketId = undefined;
        this.remoteUserId = undefined;
        this.currentUserId = undefined;
        this.socket.emit('disconnect');
        this.isConnected = false;
    }

    public async hangupCall() {
        this.socket.emit('hangup', { recipientId: this.remoteUserId });
        try {
            this.peerConnection.close()
            
            this.remoteRTCMessage = undefined;
            this.incomingOffer = undefined;
            this.otherSocketId = undefined;
            this.remoteUserId = undefined;
        } catch (error) {
            console.error('Error hanging up the call:', error);
        }
    }
    
}