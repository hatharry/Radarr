﻿using System.IO;
using Ninject;
using NLog;
using NLog.Config;
using NzbDrone.Common;
using NzbDrone.Core.Providers;

namespace NzbDrone.Core.Instrumentation
{
    public class LogConfiguration
    {
        private readonly PathProvider _pathProvider;

        public LogConfiguration(PathProvider pathProvider)
        {
            _pathProvider = pathProvider;
        }

        public void Setup()
        {
            if (Common.EnviromentProvider.IsProduction)
            {
                LogManager.ThrowExceptions = false;
            }

            LogManager.Configuration = new XmlLoggingConfiguration(_pathProvider.LogConfigFile, false);

            Common.LogConfiguration.RegisterConsoleLogger(LogLevel.Info, "NzbDrone.Web.MvcApplication");
            Common.LogConfiguration.RegisterConsoleLogger(LogLevel.Info, "NzbDrone.Core.CentralDispatch");

            LogManager.ConfigurationReloaded += ((s, e) => RegisterDatabaseLogger(CentralDispatch.NinjectKernel.Get<DatabaseTarget>()));
        }

        public static void RegisterDatabaseLogger(DatabaseTarget databaseTarget)
        {
            LogManager.Configuration.AddTarget("DbLogger", databaseTarget);
            LogManager.Configuration.LoggingRules.Add(new LoggingRule("*", LogLevel.Debug, databaseTarget));
            Common.LogConfiguration.Reload();
        }
    }
}