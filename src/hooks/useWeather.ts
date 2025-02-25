import { useState, useEffect } from 'react';

interface WeatherData {
  temp: string;
  humidity: string;
  text: string;
  windDir: string;
  city: string;
  updateTime: string;
}

interface LocationData {
  name: string;
  id: string;
  lat: string;
  lon: string;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  // 获取用户位置信息
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // 先检查本地缓存
        const cachedLocation = localStorage.getItem('weather_location');
        const cachedTimestamp = localStorage.getItem('weather_location_timestamp');
        
        // 如果缓存存在且未过期（24小时内）
        if (cachedLocation && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setLocation(JSON.parse(cachedLocation));
            return;
          }
        }

        // 使用 IP-API 获取用户位置信息
        const ipResponse = await fetch('http://ip-api.com/json/?lang=zh-CN');
        if (!ipResponse.ok) {
          throw new Error('无法获取位置信息，请检查网络连接');
        }
        
        const ipData = await ipResponse.json();
        
        if (ipData.status === 'success') {
          // 使用和风天气 API 搜索城市
          const API_KEY = import.meta.env.VITE_QWEATHER_API_KEY;
          if (!API_KEY) {
            throw new Error('天气服务配置异常，请联系管理员');
          }

          const cityResponse = await fetch(
            `https://geoapi.qweather.com/v2/city/lookup?key=${API_KEY}&location=${ipData.city}`
          );
          
          if (!cityResponse.ok) {
            throw new Error('天气服务暂时不可用，请稍后再试');
          }

          const cityData = await cityResponse.json();

          if (cityData.code === '200' && cityData.location?.[0]) {
            const locationData = {
              name: cityData.location[0].name,
              id: cityData.location[0].id,
              lat: cityData.location[0].lat,
              lon: cityData.location[0].lon
            };
            
            // 保存到本地缓存
            localStorage.setItem('weather_location', JSON.stringify(locationData));
            localStorage.setItem('weather_location_timestamp', Date.now().toString());
            
            setLocation(locationData);
          } else if (cityData.code === '404') {
            throw new Error(`抱歉，暂不支持 ${ipData.city} 地区的天气服务`);
          } else {
            throw new Error('无法获取城市信息，请稍后再试');
          }
        } else {
          throw new Error('无法确定您的位置信息');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '位置信息获取失败';
        setError(errorMessage);
        console.error('Location fetch error:', err);
        
        // 如果发生错误，尝试使用缓存的位置信息
        const cachedLocation = localStorage.getItem('weather_location');
        if (cachedLocation) {
          setLocation(JSON.parse(cachedLocation));
          setError('使用缓存的位置信息');
        }
      }
    };

    fetchLocation();
  }, []);

  // 获取天气信息
  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;

      try {
        setLoading(true);
        const API_KEY = import.meta.env.VITE_QWEATHER_API_KEY;
        
        const response = await fetch(
          `https://devapi.qweather.com/v7/weather/now?key=${API_KEY}&location=${location.id}`
        );

        if (!response.ok) {
          throw new Error('天气服务暂时不可用，请稍后再试');
        }

        const data = await response.json();

        if (data.code === '200') {
          const weatherData = {
            temp: data.now.temp,
            humidity: data.now.humidity,
            text: data.now.text,
            windDir: data.now.windDir,
            city: location.name,
            updateTime: data.now.obsTime
          };
          
          setWeather(weatherData);
          setError(null);
          
          // 缓存天气数据
          localStorage.setItem('weather_data', JSON.stringify(weatherData));
          localStorage.setItem('weather_timestamp', Date.now().toString());
        } else if (data.code === '404') {
          throw new Error('该地区暂不支持天气服务');
        } else {
          throw new Error(data.message || '天气数据获取失败');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误';
        setError(errorMessage);
        console.error('Weather fetch error:', err);
        
        // 如果发生错误，尝试使用缓存的天气数据
        const cachedWeather = localStorage.getItem('weather_data');
        const cachedTimestamp = localStorage.getItem('weather_timestamp');
        
        if (cachedWeather && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          // 只使用1小时内的缓存数据
          if (Date.now() - timestamp < 60 * 60 * 1000) {
            setWeather(JSON.parse(cachedWeather));
            setError('使用缓存的天气数据');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeather();
      // 每30分钟更新一次天气
      const interval = setInterval(fetchWeather, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [location]);

  return { weather, loading, error };
}; 