# Note: we cannot do a staged dotnet docker build here for arm/arm64. 

# Build runtime image
# FROM mcr.microsoft.com/dotnet/aspnet:7.0
# WORKDIR /app
# COPY  /out .
# ENTRYPOINT ["dotnet", "Subtract.dll"]

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Subtract.dll"]
