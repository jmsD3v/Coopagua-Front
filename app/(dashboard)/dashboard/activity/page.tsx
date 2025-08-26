import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LogIn,
  LogOut,
  UserPlus,
  UserCog,
  UserMinus,
  type LucideIcon,
  AlertCircle,
} from 'lucide-react';
import { ActivityType } from '@/lib/db/schema';
import { getAllActivityLogs } from '@/lib/db/queries';

const iconMap: Record<string, LucideIcon> = {
  [ActivityType.USER_LOGIN]: LogIn,
  [ActivityType.USER_LOGOUT]: LogOut,
  [ActivityType.USER_CREATE]: UserPlus,
  [ActivityType.USER_UPDATE]: UserCog,
  [ActivityType.USER_DELETE]: UserMinus,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  if (diffInSeconds < 3600)
    return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800)
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType, userName: string | null): string {
  const user = userName || 'Un usuario';
  switch (action) {
    case ActivityType.USER_LOGIN:
      return `${user} inició sesión`;
    case ActivityType.USER_LOGOUT:
      return `${user} cerró sesión`;
    case ActivityType.USER_CREATE:
      return `${user} creó una nueva cuenta`;
    case ActivityType.USER_UPDATE:
      return `${user} actualizó una cuenta`;
    case ActivityType.USER_DELETE:
      return `${user} eliminó una cuenta`;
    default:
      return `Acción desconocida realizada por ${user}`;
  }
}

export default async function ActivityPage() {
  const logs = await getAllActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        Registro de Actividad
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || AlertCircle;
                const formattedAction = formatAction(
                  log.action as ActivityType,
                  log.user?.name
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {formattedAction}
                        {log.ipAddress && ` desde la IP ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aún no hay actividad
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Cuando los administradores realicen acciones, aparecerán aquí.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
