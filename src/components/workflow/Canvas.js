import React, { useEffect, useRef, useState } from 'react';
import { GitBranch, Plus, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';
import WorkflowNode from './WorkflowNode';

const Canvas = () => {
  const {
    nodes,
    connections,
    isDrawingConnection,
    connectionStart,
    connectionEnd,
    potentialTarget,
    canvasRef,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    addNewNode,
    deleteConnection,
    lastCreatedNodeId
  } = useWorkflowContext();

  // Ref for tracking the current zoom level
  const zoomLevelRef = useRef(1);
  // Ref for tracking pan offset
  const panOffsetRef = useRef({ x: 0, y: 0 });
  // Ref for the canvas container to apply transforms
  const canvasContainerRef = useRef(null);

  // Add event listeners for the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      handleCanvasMouseMove(e);
    };

    const handleMouseUp = (e) => {
      handleCanvasMouseUp(e);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, handleCanvasMouseMove, handleCanvasMouseUp]);

  // Scroll to newly created node
  useEffect(() => {
    if (lastCreatedNodeId && nodes.length > 0) {
      const newNode = nodes.find(n => n.id === lastCreatedNodeId);
      if (newNode && canvasRef.current) {
        canvasRef.current.scrollTo({
          left: newNode.position.x - 100,
          top: newNode.position.y - 100,
          behavior: 'smooth'
        });
      }
    }
  }, [lastCreatedNodeId, nodes]);

  // Function to handle zooming
  const handleZoom = (zoomIn) => {
    if (canvasContainerRef.current) {
      const newZoom = zoomIn 
        ? Math.min(zoomLevelRef.current + 0.1, 2) // Max zoom: 2x
        : Math.max(zoomLevelRef.current - 0.1, 0.5); // Min zoom: 0.5x
      
      zoomLevelRef.current = newZoom;
      canvasContainerRef.current.style.transform = `scale(${newZoom}) translate(${panOffsetRef.current.x}px, ${panOffsetRef.current.y}px)`;
    }
  };

  // Function to reset zoom and pan
  const resetZoomAndPan = () => {
    if (canvasContainerRef.current) {
      zoomLevelRef.current = 1;
      panOffsetRef.current = { x: 0, y: 0 };
      canvasContainerRef.current.style.transform = 'scale(1) translate(0px, 0px)';
    }
  };

  // Pan state for drag-to-pan functionality
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Handle canvas panning
  const handleCanvasMouseDown = (e) => {
    // Only initiate panning with middle mouse button (button 1) or space+left click
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      
      // Add event listeners for panning
      document.addEventListener('mousemove', handlePanMove);
      document.addEventListener('mouseup', handlePanEnd);
    }
  };
  
  const handlePanMove = (e) => {
    if (isPanning && canvasContainerRef.current) {
      const dx = (e.clientX - panStart.x) / zoomLevelRef.current;
      const dy = (e.clientY - panStart.y) / zoomLevelRef.current;
      
      panOffsetRef.current = {
        x: panOffsetRef.current.x + dx,
        y: panOffsetRef.current.y + dy
      };
      
      canvasContainerRef.current.style.transform = `scale(${zoomLevelRef.current}) translate(${panOffsetRef.current.x}px, ${panOffsetRef.current.y}px)`;
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handlePanEnd = () => {
    setIsPanning(false);
    document.removeEventListener('mousemove', handlePanMove);
    document.removeEventListener('mouseup', handlePanEnd);
  };
  
  // Handle mousewheel for zooming
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomIn = e.deltaY < 0;
      handleZoom(zoomIn);
    }
  };
  
  // Handle right-click to add node at position
  const handleContextMenu = (e) => {
    e.preventDefault();
    
    // Get canvas coordinates
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Show a simple context menu
    const menu = document.createElement('div');
    menu.className = 'absolute bg-white shadow-lg rounded-md z-50';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    
    const addPromptButton = document.createElement('button');
    addPromptButton.className = 'block w-full text-left px-4 py-2 hover:bg-blue-50 text-sm';
    addPromptButton.innerText = 'Add Prompt Node';
    addPromptButton.onclick = () => {
      addNewNode('prompt', { x, y });
      document.body.removeChild(menu);
    };
    
    const addActionButton = document.createElement('button');
    addActionButton.className = 'block w-full text-left px-4 py-2 hover:bg-blue-50 text-sm';
    addActionButton.innerText = 'Add Action Node';
    addActionButton.onclick = () => {
      addNewNode('action', { x, y });
      document.body.removeChild(menu);
    };
    
    const addConditionButton = document.createElement('button');
    addConditionButton.className = 'block w-full text-left px-4 py-2 hover:bg-blue-50 text-sm';
    addConditionButton.innerText = 'Add Condition Node';
    addConditionButton.onclick = () => {
      addNewNode('condition', { x, y });
      document.body.removeChild(menu);
    };
    
    menu.appendChild(addPromptButton);
    menu.appendChild(addActionButton);
    menu.appendChild(addConditionButton);
    document.body.appendChild(menu);
    
    // Handle click outside to close menu
    const handleOutsideClick = () => {
      if (document.body.contains(menu)) {
        document.body.removeChild(menu);
      }
      document.removeEventListener('click', handleOutsideClick);
    };
    
    // Delay adding the listener to prevent immediate closure
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  }
};