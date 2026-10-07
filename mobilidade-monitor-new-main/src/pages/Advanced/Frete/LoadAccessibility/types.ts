export interface ObstaclesProps {
  cityId: number;
  created_at: string;
  id: number;
  obstacle: {
    description: string;
    id: number;
    picture: any;
    statusId: number;
  };
  obstacleOnFloorId: number;
  statusId: number;
  updated_at: string;
  value: number;
  valuePerFloor: number;
}
