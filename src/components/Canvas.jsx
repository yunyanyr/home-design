"use client";
import { useDroppable } from "@dnd-kit/core";
import _ from "lodash";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  ITEM_TYPES,
  ROOM_COLORS,
  FURNITURE_TYPES_LABEL_CN,
  FURNITURE_TYPES_LABEL_TW,
  FURNITURE_TYPES,
} from "@/types/room";

import { Trash2, Save, Minus, Plus, RotateCcwSquare } from "lucide-react";
import Image from "next/image";
import Undo from "./canvasComp/Undo";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
// import InfiniteCanvas from 'infinite-canvas';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import useMobile from "@/app/hooks/useMobile";
import { ToastContainer, toast } from 'react-toastify';

const MAX_SCALE = 120;
const MIN_SCALE = 50;
let containerRect;
export const Canvas = forwardRef(
  (
    {
      items,
      onShowTab,
      showTab,
      history,
      historyIndex,
      setHistory,
      setHistoryIndex,
      handleUndo,
      handleRedo,
      onGenReport,
      locale
    },
    ref
  ) => {

    const FURNITURE_TYPES_LABEL = locale === 'zh-TW' ? FURNITURE_TYPES_LABEL_TW : FURNITURE_TYPES_LABEL_CN;
    const t = useTranslations("design");
    const isMobile = useMobile();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [activeRoom, setActiveRoom] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 2000, height: 2000 });
    const [isRoomDragging, setIsRoomDragging] = useState(false);
    const [roomDragStart, setRoomDragStart] = useState({ x: 0, y: 0 });
    const [draggedRoom, setDraggedRoom] = useState(null);
    const [localItems, setLocalItems] = useState([]);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [resizeCorner, setResizeCorner] = useState(null);
    const [scale, setScale] = useState(100);
    const [touchStore, setTouchStore] = useState({
      originScale: 100,
      isMoving: false,
      pageX: 0,
      pageY: 0,
      pageX2: 0,
      pageY2: 0,
      initialDistance: 0,
    });
    const [compassRotation, setCompassRotation] = useState(0); //指南针旋转角度

    useImperativeHandle(
      ref,
      () => ({
        getLocalItems: () => localItems,
        setLocalItems,
        setActiveRoom,
        setIsRoomDragging,
        setDraggedRoom,
        setRoomDragStart,
        setPosition,
        setCompassRotation,
        getPosition: () => position,
        getCompassRotation: () => compassRotation,
        getScale: () => scale,
        setScale
      }),
      [localItems, position, compassRotation, scale]
    );

    const containerRef = useRef(null);
    const { setNodeRef } = useDroppable({
      id: "canvas",
      data: {
        accepts: [ITEM_TYPES.ROOM, ITEM_TYPES.FURNITURE],
      },
    });
    useEffect(() => {
      containerRect = document.getElementById("canvas-drop-area")?.getBoundingClientRect();
    }, [])
    // 计算画布需要的大小
    // useEffect(() => {
    //   if (localItems.length === 0) return;

    //   let maxX = -Infinity;
    //   let maxY = -Infinity;
    //   let minX = Infinity;
    //   let minY = Infinity;

    //   localItems.forEach(item => {
    //     const itemRight = item.position.x + item.size?.width;
    //     const itemBottom = item.position.y + item.size?.height;

    //     maxX = Math.max(maxX, itemRight);
    //     maxY = Math.max(maxY, itemBottom);
    //     minX = Math.min(minX, item.position.x);
    //     minY = Math.min(minY, item.position.y);
    //   });

    //   // 确保最小尺寸为5000x5000
    //   const newWidth = Math.max(5000, maxX - minX + CANVAS_PADDING * 2);
    //   const newHeight = Math.max(5000, maxY - minY + CANVAS_PADDING * 2);

    //   if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
    //     setCanvasSize({ width: newWidth, height: newHeight });
    //     setPosition({ x: newWidth - 5000, y: minY });
    //   }
    // }, [localItems, canvasSize.width, canvasSize.height]);

    // 计算两点之间的距离
    const getDistance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };


    // 处理画布拖动开始
    const handleCanvasMouseDown = useCallback(
      (e) => {
        if (e.target.closest('[data-room-element="true"]')) {
          return;
        }
        //console.log('handleCanvasMouseDown', e.target.id)
        if (e.target.id !== 'canvas') return;

        if (e.button !== 0 && !e.touches) return; //非左键

        if (e.touches?.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const initialDistance = getDistance(
            touch1.pageX,
            touch1.pageY,
            touch2.pageX,
            touch2.pageY
          );

          setTouchStore(prev => ({
            ...prev,
            isMoving: true,
            pageX: touch1.pageX,
            pageY: touch1.pageY,
            pageX2: touch2.pageX,
            pageY2: touch2.pageY,
            initialDistance,
            originScale: scale
          }));
          return;
        }

        setActiveRoom(null);
        setIsDragging(true);
        if (e.touches?.length === 1) {
          setDragStart({
            x: e.touches[0].clientX - position.x,
            y: e.touches[0].clientY - position.y,
          });
        } else {
          setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          });
        }
      },
      [position, scale]
    );

    const furnitureInroom = (furniture, parentRoom) => {
      if (!furniture.position || !parentRoom.position) return false;
      let t = 20;
      console.log('家具在里面', furniture.rotation);
      if (furniture.rotation === -90 || furniture.rotation === -270) {
        console.log('ss', furniture.size.width, furniture.size.height);
        t = Math.abs(furniture.size.width - furniture.size.height) / 2 + t;
      }
      return (
        furniture.position.x + t >= parentRoom.position.x &&
        furniture.position.x <= parentRoom.position.x + parentRoom.size.width &&
        furniture.position.x - t + furniture.size.width <=
        parentRoom.position.x + parentRoom.size.width &&
        furniture.position.y + t >= parentRoom.position.y &&
        furniture.position.y <=
        parentRoom.position.y + parentRoom.size.height &&
        furniture.position.y - t + furniture.size.height <=
        parentRoom.position.y + parentRoom.size.height
      );
    };
    // 处理房间拖动开始
    const handleRoomMouseDown = useCallback(
      (e, room) => {
        e.stopPropagation();
        setIsRoomDragging(true);
        setDraggedRoom(room);
        // 计算鼠标点击位置相对于房间左上角的偏移
        if (e.touches?.length == 1) {
          setRoomDragStart({
            x: e.touches[0].clientX - room.position.x,
            y: e.touches[0].clientY - room.position.y,
          });
          // console.log("handleRoomMouseDown", room.position.x);
        } else {
          setRoomDragStart({
            x: e.clientX - room.position.x,
            y: e.clientY - room.position.y,
          });
        }
        if (room.type === ITEM_TYPES.ROOM) {
          //给每个家具设置一个偏移量
          const furnitureList = localItems.map((item) => {
            if (
              item.type === ITEM_TYPES.FURNITURE &&
              furnitureInroom(item, room)
            ) {
              // console.log("家具在里面", item, room);
              return {
                ...item,
                parentId: room.id,
                offset: {
                  x: item.position.x - room.position.x,
                  y: item.position.y - room.position.y,
                },
              };
            } else {
              return {
                ...item,
                parentId: null,
              };
            }
          });
          // console.log('ddd',furnitureList);
          let updatedItems = localItems.map((item) => {
            let target = furnitureList.find(
              (furniture) => furniture.id === item.id
            );
            return target || item;
          });
          // console.log('updatedItems',updatedItems);
          setLocalItems(updatedItems);
        }
      },
      [localItems]
    );

    // 处理调整大小开始
    const handleResizeStart = useCallback((e, room, corner) => {
      e.stopPropagation();
      setIsResizing(true);
      setResizeCorner(corner);
      if (e.touches?.length == 1) {
        // console.log('handleResizeStart', e)
        setResizeStart({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      } else {
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
        });
      }
    }, []);

    const debounceToastInfo = _.throttle(toast.info, 3000);
    // 处理鼠标移动事件
    const handleMouseMove =
      (e) => {
        e.preventDefault();
        //e.stopPropagation();
        //console.log('handleMouseMove', e.target);
        // if (e.target.id !== 'canvas' || !e.target.closest('[data-room-element="true"]')) return;
        if (e.touches?.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];

          const currentDistance = getDistance(
            touch1.pageX,
            touch1.pageY,
            touch2.pageX,
            touch2.pageY
          );

          if (touchStore.initialDistance) {
            if (currentDistance > touchStore.initialDistance) {
              handleZoom('in', 1);
            } else {
              handleZoom('out', 1);
            }
            // const scaleFactor = Math.max(currentDistance / touchStore.initialDistance) ;
            // const newScale = Math.min(
            //   110,
            //   Math.max(90, Math.round(touchStore.originScale * scaleFactor))
            // );
            // onTransCanvas(newScale);
            // setScale(newScale);
          } else {
            setTouchStore(prev => ({
              ...prev,
              initialDistance: currentDistance,
              originScale: scale
            }));
          }
        } else if (isResizing && activeRoom && resizeCorner) {
          let deltaX, deltaY;
          if (e.touches?.length == 1) {
            deltaX = e.touches[0].clientX - resizeStart.x;
            deltaY = e.touches[0].clientY - resizeStart.y;
          } else {
            deltaX = e.clientX - resizeStart.x;
            deltaY = e.clientY - resizeStart.y;
          }
          let ratio = activeRoom.size.width / activeRoom.size.height;
          const updatedItems = localItems.map((item) => {
            if (item.id === activeRoom.id) {
              const newSize = { ...item.size };
              const newPosition = { ...item.position };

              switch (resizeCorner) {
                case "top-left":
                  newSize.width = item.size.width - deltaX;
                  if (activeRoom.type === ITEM_TYPES.ROOM) {
                    //房间自由调整
                    newSize.height = item.size.height - deltaY;
                  } else {
                    //家具限制宽高比例
                    newSize.height = newSize.width / ratio;
                  }

                  newPosition.x = item.position.x + deltaX;
                  newPosition.y = item.position.y + deltaY;
                  break;
                case "top-right":
                  newSize.width = item.size.width + deltaX;
                  if (activeRoom.type === ITEM_TYPES.ROOM) {
                    //房间自由调整
                    newSize.height = item.size.height - deltaY;
                  } else {
                    //家具限制宽高比例
                    newSize.height = newSize.width / ratio;
                  }

                  newPosition.y = item.position.y + deltaY;
                  break;
                case "bottom-left":
                  newSize.width = item.size.width - deltaX;
                  if (activeRoom.type === ITEM_TYPES.ROOM) {
                    //房间自由调整
                    newSize.height = item.size.height + deltaY;
                  } else {
                    //家具限制宽高比例
                    newSize.height = newSize.width / ratio;
                  }

                  newPosition.x = item.position.x + deltaX;
                  break;
                case "bottom-right":
                  newSize.width = item.size.width + deltaX;
                  if (activeRoom.type === ITEM_TYPES.ROOM) {
                    //房间自由调整
                    newSize.height = item.size.height + deltaY;
                  } else {
                    //家具限制宽高比例
                    newSize.height = newSize.width / ratio;
                  }

                  break;
              }

              let condition;
              if (item.type === ITEM_TYPES.ROOM) {
                condition = newSize.width >= 100 && newSize.height >= 100;
              } else if (item.data.type === FURNITURE_TYPES.WINDOW) {
                condition = newSize.width >= 8 && newSize.height >= 8;
              } else condition = newSize.width >= 20 && newSize.height >= 20;

              // 房间最小尺寸100，家具最小尺寸
              if (condition) {
                return {
                  ...item,
                  size: newSize,
                  position: newPosition,
                  //relativePosition: newPosition
                };
              }
              return item;
            }
            return item;
          });
          setLocalItems(updatedItems);
          if (e.touches?.length == 1) {
            setResizeStart({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            });
          } else {
            setResizeStart({
              x: e.clientX,
              y: e.clientY,
            });
          }
        } else if (isRoomDragging && draggedRoom) {
          // console.log("isRoomDragging");
          let newX, newY;
          if (e.touches?.length == 1) {
            newX = e.touches[0].clientX - roomDragStart.x;
            newY = e.touches[0].clientY - roomDragStart.y;
            // console.log("newX", newX, newY);
          } else {
            newX = e.clientX - roomDragStart.x;
            newY = e.clientY - roomDragStart.y;
          }
          newX = Math.max(0, newX); // 限制x轴最小值为0
          newY = Math.max(0, newY); // 限制y轴最小值为0
          let updatedItems = [];
          // console.log('localItems',localItems);
          if (draggedRoom.type === ITEM_TYPES.ROOM) {
            //其中家具一起移动
            const furnitureIdList = localItems
              .filter((item) => {
                //  console.log(item,  furnitureInroom(item, draggedRoom));
                return (
                  item.type === ITEM_TYPES.FURNITURE &&
                  item.parentId === draggedRoom.id
                );
                // furnitureInroom(item, draggedRoom)
              })
              .map((item) => item.id);

            updatedItems = localItems.map((item) => {
              if (item.id === draggedRoom.id) {
                return {
                  ...item,
                  position: {
                    x: newX,
                    y: newY,
                  },
                };
              } else if (furnitureIdList.includes(item.id)) {
                // console.log(item.offset);
                return {
                  ...item,
                  position: {
                    x: newX + item.offset?.x || 0,
                    y: newY + item.offset?.y || 0,
                  },
                };
              }
              return item;
            });
          } else {
            updatedItems = localItems.map((item) => {
              if (item.id === draggedRoom.id) {
                return {
                  ...item,
                  position: {
                    x: newX,
                    y: newY,
                  },
                };
              }
              return item;
            });
          }

          setLocalItems(updatedItems);
        } else if (isDragging) {
          let newX, newY;
          if (e.touches?.length === 1) {
            newX = e.touches[0].clientX - dragStart.x;
            newY = e.touches[0].clientY - dragStart.y;
          } else {
            newX = e.clientX - dragStart.x;
            newY = e.clientY - dragStart.y;
          }
          // console.log('ne', newX, newY, e.clientX, e.clientY);
          //无限画布效果。


          let canvasWidth, canvasHeight;
          if (newX > 0) {
            // debounceToastInfo("到底啦",
            //   {
            //     closeButton: false
            //   })
            newX = 0;
          }
          if (newY > 0) {
            newY = 0;
          }
          if (newX < -1000) {
            newX = -1000;
          }
          if (newY < -1000) {
            newY = -1000;
          }

          if (2000 + newX < containerRect.width / (scale / 100)) {
            canvasWidth = (2000 - newX) / (scale / 100);
            // if (scale < 100) {
            //   canvasWidth = canvasWidth / (scale / 100)
            // }


          }
          if (2000 + newY < containerRect.height / (scale / 100)) {

            canvasHeight = (2000 - newY) / (scale / 100)
          }

          setPosition({
            x: newX,
            y: newY,
          });
          setCanvasSize({ width: canvasWidth || canvasSize.width, height: canvasHeight || canvasSize.height });
        }
      }


    // 处理鼠标松开事件
    const handleMouseUp =
      useCallback(
        (e) => {
          if (e.touches?.length < 2) {
            setTouchStore(prev => ({ ...prev, isMoving: false, initialDistance: 0 }));
          }
          //console.log("localItems", localItems);
          // console.log('handleMouseUp', e)
          // 如果是房间拖动或调整大小结束，记录历史
          if (isRoomDragging || isResizing) {
            let newX, newY;
            if (e.changedTouches?.length == 1) {
              newX = e.changedTouches[0].clientX - roomDragStart.x - position.x;
              newY = e.changedTouches[0].clientY - roomDragStart.y - position.y;
            } else {
              newX = e.clientX - roomDragStart.x - position.x;
              newY = e.clientY - roomDragStart.y - position.y;
            }

            let newItems;
            if (
              draggedRoom &&
              !localItems.some((item) => item.id === draggedRoom.id)
            ) {
              //新添加的房间/家具,设置坐标
              // newX+ (scale - 100) * 15
              const newRoom = {
                ...draggedRoom,
                position: {
                  x: newX / (scale / 100),

                  y: newY / (scale / 100),
                },
                data: {
                  ...draggedRoom.data,
                  label: `${draggedRoom.data.label}`,
                  //parentRoom: draggedRoom.id,
                }
              };
              newItems = [...localItems, newRoom];

              setLocalItems(newItems);
              onHandleActiveRoom(newRoom, newItems);
            } else {
              //移动结束一个已有的房间/家具
              newItems = localItems
            }

            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newItems);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
          }

          setIsDragging(false);
          setIsRoomDragging(false);

          setDraggedRoom(null);
          setIsResizing(false);
          setResizeCorner(null);
        }
        ,
        [
          isRoomDragging,
          isResizing,
          localItems,
          history,
          historyIndex,
          roomDragStart,
          draggedRoom,
          position,
          touchStore,
        ]
      );

    const onHandleActiveRoom = (room, _localItems) => {
      if (room.type === ITEM_TYPES.FURNITURE) {
        //每次选中家具，都对当前家具的房间重新排序
        const currentItems = _localItems || localItems;
        let parentRoom = currentItems.find((item) => {
          //console.log(room.position.x, item.position.x,item.size.width,room.position.y,item.position.y,item.size.height)
          return item.type === ITEM_TYPES.ROOM && furnitureInroom(room, item);
        });
        //
        if (!parentRoom) {
          console.log("选中家具，当前未匹配到房间");
          let newLocalItems = _.cloneDeep(currentItems);
          let target = newLocalItems.filter((item) => item.id === room.id)[0];
          if (target) {
            target.data.label = `未分配-${FURNITURE_TYPES_LABEL[target.data.type]
              }`;
            target.data.parentRoom = null;
            room.data.label = `未分配-${FURNITURE_TYPES_LABEL[target.data.type]
              }`;
            room.data.parentRoom = null;
            setLocalItems(newLocalItems);
          }
        } else {
          //按x坐标升序排序
          const furnitureList = currentItems
            .filter(
              (item) =>
                item.type === ITEM_TYPES.FURNITURE &&
                item.data.type === room.data.type &&
                furnitureInroom(item, parentRoom)
            )
            .sort((a, b) => a.position.x - b.position.x)
            .map((item, index) => {
              let label = `${parentRoom.data.label}-${FURNITURE_TYPES_LABEL[room.data.type]
                }${index + 1}`;
              if (item.id === room.id) {
                room.data.label = label;
                room.data.parentRoom = parentRoom;
              }
              return {
                ...item,
                data: {
                  ...item.data,
                  label,
                  parentRoom,
                },
              };
            });
          // console.log('furnitureList',furnitureList)
          let newLocalItems = currentItems.map((item) => {
            let target = furnitureList.find(
              (furniture) => furniture.id === item.id
            );
            return target || item;
          });
          setLocalItems(newLocalItems);
        }
      }
      setTimeout(() => {
        // console.log('room',room)
        setActiveRoom(room);
      });
    };
    // 添加事件监听器
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      container.addEventListener("mousedown", handleCanvasMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      container.addEventListener("touchstart", handleCanvasMouseDown);
      window.addEventListener("touchmove", handleMouseMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);

      return () => {
        container.removeEventListener("mousedown", handleCanvasMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        container.removeEventListener("touchstart", handleCanvasMouseDown);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }, [handleCanvasMouseDown, handleMouseMove, handleMouseUp]);
    // 检查是否满足基本要求（至少一个房间、一个门和一个窗）
    const hasRequiredItems = () => {
      const hasRoom = items.some(
        (item) =>
          item.type === ITEM_TYPES.ROOM &&
          item.data.type !== "door" &&
          item.data.type !== "window"
      );
      const hasDoor = items.some(
        (item) => item.type === ITEM_TYPES.ROOM && item.data.type === "door"
      );
      const hasWindow = items.some(
        (item) => item.type === ITEM_TYPES.ROOM && item.data.type === "window"
      );
      return hasRoom && hasDoor && hasWindow;
    };

    // 处理缩放
    function handleZoom(type, step = 5) {
      let newScale;
      if (type === "in" && scale < MAX_SCALE) {
        newScale = scale + step;
      } else if (type === "out" && scale > MIN_SCALE) {
        newScale = scale - step;
      } else if (type === "reset") {
        newScale = 100;
      } else {
        return;
      }


      if (type === 'out') {
        setCanvasSize({
          width: (canvasSize.width - (position.x < 0 ? position.x : 0)) * (1 + (scale - newScale) / 100),
          height: (canvasSize.height - (position.y < 0 ? position.y : 0)) * (1 + (scale - newScale) / 100)
        })
      }
      // let updatedItems = localItems.map((item) => {
      //   // console.log(1 + (newScale - scale) / 100)
      //   // let width = item.size.width + 300 * ((newScale - scale) / 100);
      //   // let height = item.size.height + 300 * ((newScale - scale) / 100);
      //   let dom = document.getElementById(item.id);
      //   let rect = dom.getBoundingClientRect();
      //   //console.log(rect, dom.style.top, dom.style.left, dom.style.width, dom.style.height)
      //   // return item;
      //   const initialTop = 1 * dom.style.top.split('px')[0];
      //   const initialLeft = 1 * dom.style.left.split('px')[0];
      //   const initialWidth = 1 * dom.style.width.split('px')[0];
      //   const initialHeight = 1 * dom.style.height.split('px')[0];


      //   // 计算缩放后的位置和尺寸
      //   const scaledWidth = initialWidth * newScale / 100;
      //   const scaledHeight = initialHeight * newScale / 100;
      //   const scaledTop = initialTop - (scaledHeight - initialHeight) / 2;
      //   const scaledLeft = initialLeft - (scaledWidth - initialWidth) / 2;
      //   console.log(initialTop, initialLeft, scaledTop, scaledLeft)
      //   // 应用缩放和调整后的位置
      //   return {
      //     ...item,
      //     position: {
      //       x: scaledLeft,
      //       y: scaledTop
      //     }
      //   }
      //   // box.style.transform = `scale(${scale})`;
      //   // box.style.top = `${scaledTop}px`;
      //   // box.style.left = `${scaledLeft}px`;
      //   // return {
      //   //   ...item,
      //   //   position: {
      //   //     x: item.position.x * (1 + (newScale - scale) / 100),
      //   //     y: item.position.y * (1 + (newScale - scale) / 100),
      //   //   },
      //   //   // item.size.width * (1 + (newScale - scale) / 100),
      //   //   //item.position.x * (1 + (newScale - scale) / 100),
      //   //   //+ 300 * ((newScale - scale) / 100),
      //   //   // size: {
      //   //   //   width,
      //   //   //   height,
      //   //   // }
      //   // }
      // })
      // setLocalItems(updatedItems);
      // 更新状态
      //onTransCanvas(type, newScale);
      setScale(newScale);

    };
    function onTransCanvas(type, newScale) {
      // 获取画布容器和画布元素
      // const container = document.getElementById("canvas-drop-area");
      // const containerRect = document.getElementById("canvas-drop-area").getBoundingClientRect();
      // //console.log('111', containerRect, container.querySelector('.cursor-move'));
      // const canvasRect = container.querySelector('.cursor-move').getBoundingClientRect();
      // console.log('222', canvasRect.width, canvasRect.height);
      // const x1 = (containerRect.width - canvasRect.width) / 2;
      // const y1 = (containerRect.height - canvasRect.height) / 2;
      // // 获取画布相对于视口的位置和尺寸
      // //const canvasRect = containerRef.current.querySelector('.cursor-move').getBoundingClientRect();
      // const newPositionX = (containerRect.width - canvasRect.width * (newScale / 100)) / 2;
      // const newPositionY = (containerRect.height - canvasRect.height * (newScale / 100)) / 2;
      //setPosition({ x: newPositionX, y: newPositionY });
      //console.log(newPositionX - x1, newPositionY - y1, position);
      // if (type === 'in') {
      //   setPosition({ x: position.x + 150, y: position.y + 150 });
      // } else if (type === 'out') {
      //   setPosition({ x: position.x - 150, y: position.y - 150 });
      // }

    }
    const handleRotate = useCallback(() => {
      if (!activeRoom) return;

      const updatedItems = localItems.map((item) => {
        if (item.id === activeRoom.id) {
          // 计算新的旋转角度（每次增加45度，对360取模）
          const newRotation = ((item.rotation || 0) - 45) % 360;

          // 如果是90度或270度旋转，需要交换宽高
          // const isOddRotation = Math.abs(newRotation) % 180 === 90;
          // const newWidth = isOddRotation ? item.size.height : item.size.width;
          // const newHeight = isOddRotation ? item.size.width : item.size.height;
          // //          // 计算旋转后的新位置，保持中心点不变
          // const centerX = item.position.x + item.size.width / 2;
          // const centerY = item.position.y + item.size.height / 2;
          // //  console.log(newWidth,newHeight)
          // //  // 计算新的左上角位置
          // const newX = centerX - newWidth / 2;
          // const newY = centerY - newHeight / 2;
          //  console.log(item.position.x,newX,item.position.y ,newY)
          return {
            ...item,
            rotation: newRotation,
            // position: {
            //   x: newX,
            //   y: newY
            // },
            //  size: {
            //    width: newWidth,
            //    height: newHeight
            // }
          };
        }
        return item;
      });

      setLocalItems(updatedItems);
    }, [activeRoom, localItems]);
    const onCompassClick = () => {
      // console.log("compass");
      // 增加45度，并保持在0-360范围内
      let newRotation = compassRotation + 45;
      // if (newRotation >= 360) {
      //   newRotation -= 360;
      // }
      setCompassRotation(newRotation);
    };

    const Sizehandler = (room) => {
      return (
        <>
          <div
            className="absolute w-3 h-3 bg-white border border-red-500 cursor-nw-resize rounded-full"
            style={{ top: -6, left: -6 }}
            onMouseDown={(e) => handleResizeStart(e, room, "top-left")}
            onTouchStart={(e) => handleResizeStart(e, room, "top-left")}
          />
          <div
            className="absolute w-3 h-3 bg-white border border-red-500 cursor-ne-resize rounded-full"
            style={{ top: -6, right: -6 }}
            onMouseDown={(e) => handleResizeStart(e, room, "top-right")}
            onTouchStart={(e) => handleResizeStart(e, room, "top-right")}
          />
          <div
            className="absolute w-3 h-3 bg-white border border-red-500 cursor-sw-resize rounded-full"
            style={{ bottom: -6, left: -6 }}
            onMouseDown={(e) => handleResizeStart(e, room, "bottom-left")}
            onTouchStart={(e) => handleResizeStart(e, room, "bottom-left")}
          />
          <div
            className="absolute w-3 h-3 bg-white border border-red-500 cursor-se-resize rounded-full"
            style={{ bottom: -6, right: -6 }}
            onMouseDown={(e) => handleResizeStart(e, room, "bottom-right")}
            onTouchStart={(e) => handleResizeStart(e, room, "bottom-right")}
          />
        </>
      );
    };

    // console.log('localItems',localItems) 
    // scale(${scale / 100})
    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          setNodeRef(node);
        }}
        className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden bg-background"
      >

        {/* 右上角控制面板 */}
        <div className="fixed top-20 right-6 flex items-center gap-4 z-9">
          {!isMobile && (
            <>
              {/* 撤销/重做 */}
              <Undo
                history={history}
                historyIndex={historyIndex}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                className={" bg-white rounded-full shadow-lg  px-3 py-2"}
              />

            </>
          )}
          {/* 缩放控制 */}
          <div className="flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-2">
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-600"
              onClick={(e) => handleZoom("out")}
              disabled={scale <= 50}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-600 min-w-[48px] text-center">
              {scale}%
            </span>
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-600"
              onClick={(e) => handleZoom("in")}
              disabled={scale >= 120}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {/* 指南针 */}
          <div
            style={{
              transform: `rotate(${compassRotation}deg)`,
              transition: "transform 0.3s ease-out",
            }}
            onClick={onCompassClick}
            className="flex flex-col items-center"
          >
            <div className="text-sm text-gray-600">N</div>

            <Image
              src="/images/compass.png"
              alt="方向"
              width={40}
              height={40}
              className="cursor-pointer"
            />
            {/* 显示当前角度 */}
          </div>
        </div>
        {/* translate(${position.x}px, ${position.y}px) */}
        <div
          id='canvas'
          className="absolute cursor-move"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            transform: `translate(${position.x}px, ${position.y}px)  scale(${scale / 100})`,
            transformOrigin: "top left",
            backgroundImage:
              "radial-gradient(circle, #ddd 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        >
          <div className="relative">
            {localItems.map((item) => {
              if (item.type === ITEM_TYPES.ROOM) {
                return (
                  <div
                    // id={item.id}
                    key={item.id}
                    data-room-element="true"
                    className={`absolute ${activeRoom?.id === item.id ? "ring-2 ring-red-500" : ""
                      } cursor-move z-100`}
                    style={{
                      left: item.position.x,
                      top: item.position.y,
                      width: item.size.width,
                      height: item.size.height,
                      // transform: `scale(${scale / 100})`,
                      // transformOrigin: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHandleActiveRoom(item);
                    }}
                    onMouseDown={(e) => handleRoomMouseDown(e, item)}
                    onTouchStart={(e) => handleRoomMouseDown(e, item)}
                  >
                    {activeRoom && activeRoom.id === item.id && (
                      <div
                        style={{
                          left: "50%",
                          top: "-64px",
                          transform: "translateX(-50%)",
                        }}
                        className="min-w-fit whitespace-nowrap  absolute z-1 h-[40px] rounded-4xl bg-white shadow-lg  items-center px-3 gap-2 md:flex hidden"
                      >
                        <span className="text-sm text-gray-600">{t('chosed')}：</span>
                        <div className="flex flex-grow items-center gap-1">
                          {/* 颜色方块 */}
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor:
                                ROOM_COLORS[activeRoom.data.type],
                              borderRadius: "2px",
                            }}
                          />
                          {/* 房间名称 */}
                          <span className="text-sm text-gray-600 font-bold">
                            {activeRoom.data.label}
                          </span>
                        </div>

                        {/* 删除按钮 */}
                        <button
                          className="flex-shrink-0 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newItems = localItems.filter(
                              (item) => item.id !== activeRoom.id
                            );
                            setLocalItems(newItems);
                            setActiveRoom(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )}

                    <div
                      className="w-full h-full"
                      style={{
                        border:
                          item.type === ITEM_TYPES.ROOM ? "8px solid" : "none",
                        borderColor:
                          item.type === ITEM_TYPES.ROOM
                            ? ROOM_COLORS[item.data.type]
                            : "transparent",
                        borderRadius:
                          item.type === ITEM_TYPES.ROOM ? "8px" : "0",
                        backgroundColor:
                          item.type === ITEM_TYPES.ROOM
                            ? ROOM_COLORS[item.data.type] + "80"
                            : "transparent",
                      }}
                    >
                      <div
                        className="absolute top-2 left-2 text-[14px] text-[#888888]"
                        style={{
                          zIndex: 1,
                        }}
                      >
                        {item.data.label}
                      </div>
                    </div>
                    {activeRoom?.id === item.id && Sizehandler(item)}
                  </div>
                );
              } else if (item.type === ITEM_TYPES.FURNITURE) {
                // console.log('item', item)
                return (
                  <div
                    key={item.id}
                    data-room-element="true"
                    className={`absolute cursor-move z-200`}
                    style={{
                      left: item.position.x,
                      top: item.position.y,
                      width: item.size.width,
                      height: item.size.height,
                      // transform: `translate(${position.x}px, ${position.y}px)`,
                      // transformOrigin: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHandleActiveRoom(item);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleRoomMouseDown(e, item);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleRoomMouseDown(e, item);
                    }}
                  >
                    {activeRoom && activeRoom.id === item.id && (
                      <div
                        style={{
                          left: "50%",
                          top: "-64px",
                          transform: "translateX(-50%)",
                        }}
                        className="min-w-fit whitespace-nowrap absolute z-1 h-[40px] rounded-4xl bg-white shadow-lg  items-center px-3 gap-2 md:flex hidden"
                      >
                        <span className="text-sm text-gray-600">{t('chosed')}：</span>
                        <div className="flex flex-grow items-center gap-1">
                          {/* 颜色方块 */}
                          {activeRoom.data.parentRoom && (
                            <div
                              style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor:
                                  ROOM_COLORS[
                                  activeRoom.data.parentRoom.data.type
                                  ],
                                borderRadius: "2px",
                              }}
                            />
                          )}

                          {/* 家具名称 */}
                          <span className="text-sm text-gray-600 font-bold">
                            {activeRoom.data.label}
                          </span>
                        </div>
                        {/* 旋转按钮 */}
                        <button
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotate();
                          }}
                        >
                          <RotateCcwSquare className="w-4 h-4" />
                        </button>
                        {/* 删除按钮 */}
                        <button
                          className="flex-shrink-0 text-red-500 hover:text-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newItems = localItems.filter(
                              (item) => item.id !== activeRoom.id
                            );
                            setLocalItems(newItems);
                            setActiveRoom(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )}
                    {activeRoom?.id === item.id && Sizehandler(item)}
                    <Image
                      draggable="false"
                      className={
                        activeRoom?.id === item.id ? "ring-2 ring-red-500" : ""
                      }
                      style={{
                        transform: item.rotation
                          ? `rotate(${item.rotation}deg)`
                          : "none",
                        transformOrigin: "center",
                      }}
                      //  objectFit= 'contain'
                      src={item.activeIcon}
                      alt="Furniture"
                      width={item.size.width}
                      height={item.size.height}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* 选中房间的图层面板，仅在移动端显示 */}
        {activeRoom && (
          <div
            className={cn(
              "min-w-fit whitespace-nowrap fixed  left-1/2 -translate-x-1/2 h-10 rounded-4xl bg-white shadow-lg flex items-center px-3 gap-2 md:hidden",
              showTab ? "bottom-85" : "bottom-22.5 "
            )}
          >
            <span className="text-sm text-gray-600">{t('chosed')}：</span>
            <div className="flex flex-grow items-center gap-1">
              {/* 颜色方块 */}
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor:
                    ROOM_COLORS[
                    activeRoom.data.parentRoom
                      ? activeRoom.data.parentRoom.data.type
                      : activeRoom.data.type
                    ],
                  borderRadius: "2px",
                }}
              />
              {/* 房间名称 */}
              <span className="text-sm text-gray-600 font-bold">
                {activeRoom.data.label}
              </span>
            </div>
            {/* 旋转按钮 */}
            {activeRoom.type === ITEM_TYPES.FURNITURE && (
              <button
                className="flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRotate();
                }}
              >
                {" "}
                <RotateCcwSquare className="w-4 h-4" />
              </button>
            )}

            {/* 删除按钮 */}
            <button
              className="flex-shrink-0 text-red-500 hover:text-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const newItems = localItems.filter(
                  (item) => item.id !== activeRoom.id
                );
                setLocalItems(newItems);
                setActiveRoom(null);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
        {/* 移动端的操作按钮 控制显示drag tab */}
        <div className="fixed z-50 bottom-6 left-0 px-2 gap-4 w-full bg-transparent flex items-center justify-between  md:hidden">
          {!showTab && (
            <button
              onClick={onShowTab}
              className="border-primary border-1 font-bold w-4/5 py-3 bg-white text-foreground rounded-[100px] text-sm"
            >
              {t("showTab")}
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger className={cn(
              "inline-flex font-bold py-3 bg-button-gradient text-white rounded-[100px] text-sm items-center justify-center gap-0",
              showTab ? "w-full " : "w-4/5"
            )}>
              {t("cta")}
              <Image
                src="/images/hero/star.png"
                alt="arrow"
                width={15}
                height={16}
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("alert")}</AlertDialogTitle>
                {/* <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription> */}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={onGenReport}>{t("ok")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
    );
  }
);
