import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DraggableIcon({icon, className, color, code}) {

    const [{isDragging}, drag] = useDrag(() => ({
        type: "piece",
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    useEffect(() => console.log("DRAGGING"), [isDragging]);

    return <FontAwesomeIcon ref={drag} icon={icon} className={className} color={color} code={code} />;
}