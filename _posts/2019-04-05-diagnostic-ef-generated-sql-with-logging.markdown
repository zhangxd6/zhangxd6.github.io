---
title: Diagnostic EF Generated SQL with Logging
date: 2019-04-05 09:08:00 -05:00
tags:
- entityframeworkcore
- debugging
layout: post
---

Entity Framework makes it easier working with the database for .Net developers. However, if you are not careful or do not understand the limitation of translation of database queries from the LINQ code. Recently, I encounter a case that needs to inspect the generated query.

<!--more-->

# Problem
 
We noticed the application was getting slower and slower as the number of records increases in the database. First thought is that there may be missing indexes. So we fired up profiler and there is one specific query repeatedly showing up and it does not have where clause. It loads the whole table and this table is one of the fast growing one. At this point, we are sure there is a bug in the code.

# Triage  
 
 The EF core is used in our data access layer; naturally, we need a way to inspect the generated SQL query to trace back the code. This is where the logging to help.

  EF core uses ASP.NET core logging infrastructure. We can use console logger to print out the command. Good luck with having sharp eyes to flowing ever-scrolling screen. So we opted for a customized logger for this particular problem.

~~~
public class TraceLogger : ILogger
  {


    private readonly string categoryName;
    private readonly Func<string, LogLevel, bool> func;

    public TraceLogger(string categoryName, Func<string, LogLevel, bool> func)
    {
      this.categoryName = categoryName;
      this.func = func;
    }

    public bool IsEnabled(LogLevel logLevel) => true;

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception exception,
        Func<TState, Exception, string> formatter)
    {
      if (this.func(this.categoryName, logLevel))
      {
        Console.WriteLine($"{DateTime.Now.ToString("o")} {logLevel} {eventId.Id} {this.categoryName}");
        var message = formatter(state, exception);
        Console.WriteLine(message);
        //we will let debuger to pause here to be able to inspect the call stack
        if(!message.Contains("WHERE"))
        {
          System.Diagnostics.Debugger.Break();
        }
      }
      
    }

    public IDisposable BeginScope<TState>(TState state) => null;
  }

  public class TraceLoggerProvider : ILoggerProvider
  {
    private Func<string, LogLevel, bool> func;

    public TraceLoggerProvider(Func<string,LogLevel,bool>func)
    {
      this.func = func;
    }

    public ILogger CreateLogger(string categoryName) => new TraceLogger(categoryName, this.func);

    public void Dispose() { }
  }
~~~

and put logger into usage

~~~
 optionsBuilder.UseLoggerFactory(new LoggerFactory(new []
        {
          //we are only interested in the executed query
          new TraceLoggerProvider((c,l)=>c == "Microsoft.EntityFrameworkCore.Database.Command" && l== LogLevel.Information) as ILoggerProvider,
          new Microsoft.Extensions.Logging.Debug.DebugLoggerProvider((_,l)=>true) as ILoggerProvider
        }));
~~~

# Founding and Resolution

it turns out we have a LINQ query
~~~
                var updateclaims = dbcontext.Claims.Where(dc => entity.ContainsKey(dc.Id)).ToArray();
~~~

the entity is a dictionary and EF core does not know how to directly translate it to where clause so it falls back to load all records in memory and filter there.

So, we take keys out to an array of long, this way EF core can translate it to proper 
where clause 

~~~
var keys = entity.Keys.ToArray();
        var updateclaims = dbcontext.Claims.Where(dc => keys.Contains(dc.Id)).ToArray();
~~~
