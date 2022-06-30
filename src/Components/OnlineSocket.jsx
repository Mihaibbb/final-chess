import { cloneDeep } from "lodash";

export default function OnlineSocket(socket, newVirtualBoard, setNewVirtualBoard, currentMove, setCurrentMove) {
    socket.on('send-piece', (oldIdx, newIdx, pieceCode) => {
        const cloneVirtualBoard = cloneDeep(newVirtualBoard);
        const serverOldX = parseInt(oldIdx / 8);
        const serverOldY = oldIdx % 8;
        cloneVirtualBoard[serverOldX][serverOldY] = 0;
        const serverNewX = parseInt(newIdx / 8);
        const serverNewY = newIdx % 8;
        cloneVirtualBoard[serverNewX][serverNewY] = pieceCode;
        
        localStorage.setItem("current-move", -currentMove);
        setCurrentMove(-currentMove);

        localStorage.setItem("board", JSON.stringify(cloneVirtualBoard));
        setNewVirtualBoard(cloneVirtualBoard);
        
    });
}