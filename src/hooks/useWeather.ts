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

// 和风天气 API 错误码映射
const QWeatherErrorCodes: Record<string, string> = {
  '204': '请求成功，但你查询的地区暂时没有你需要的数据',
  '400': '请求错误，可能包含错误的请求参数或缺少必选的请求参数',
  '401': 'API key 错误或未找到',
  '402': '超过访问次数或余额不足以支持继续访问服务',
  '403': '无访问权限，可能是绑定的PackageID不正确或签名错误',
  '404': '查询的数据或地区不存在',
  '429': '超过限定的 QPM（每分钟访问次数）',
  '500': '服务器内部错误'
};

const getQWeatherErrorMessage = (code: string): string => {
  return QWeatherErrorCodes[code] || '未知错误';
};

const validateWeatherData = (data: any): boolean => {
  return data 
    && typeof data.temp === 'string'
    && typeof data.humidity === 'string'
    && typeof data.text === 'string'
    && typeof data.windDir === 'string';
};

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
            try {
              const parsedLocation = JSON.parse(cachedLocation);
              if (parsedLocation && parsedLocation.id && parsedLocation.name) {
                setLocation(parsedLocation);
                return;
              }
            } catch (e) {
              console.error('Invalid cached location data:', e);
              localStorage.removeItem('weather_location');
              localStorage.removeItem('weather_location_timestamp');
            }
          }
        }

        // 使用 ipapi.co 获取用户位置信息（免费版本每月30k次请求）
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (!ipResponse.ok) {
          throw new Error('无法获取位置信息，请检查网络连接');
        }
        
        const ipData = await ipResponse.json();
        
        if (ipData.city) {
          // 使用和风天气 API 搜索城市
          const API_KEY = import.meta.env.VITE_QWEATHER_API_KEY;
          if (!API_KEY) {
            throw new Error('天气服务配置异常，请联系管理员');
          }

          // 使用城市名称和省份进行更精确的定位
          const cityQuery = `${ipData.city}${ipData.region ? ',' + ipData.region : ''}`;
          const cityResponse = await fetch(
            `https://geoapi.qweather.com/v2/city/lookup?key=${API_KEY}&location=${encodeURIComponent(cityQuery)}`
          );
          
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
          } else {
            throw new Error(getQWeatherErrorMessage(cityData.code));
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
          try {
            const parsedLocation = JSON.parse(cachedLocation);
            if (parsedLocation && parsedLocation.id && parsedLocation.name) {
              setLocation(parsedLocation);
              setError('使用缓存的位置信息');
            }
          } catch (e) {
            console.error('Invalid cached location data:', e);
            localStorage.removeItem('weather_location');
            localStorage.removeItem('weather_location_timestamp');
          }
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

        const data = await response.json();

        if (data.code === '200' && data.now) {
          // 验证返回的数据是否完整
          if (!validateWeatherData(data.now)) {
            throw new Error('天气数据格式异常');
          }

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
        } else {
          throw new Error(getQWeatherErrorMessage(data.code));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误';
        setError(errorMessage);
        console.error('Weather fetch error:', err);
        
        // 如果发生错误，尝试使用缓存的天气数据
        const cachedWeather = localStorage.getItem('weather_data');
        const cachedTimestamp = localStorage.getItem('weather_timestamp');
        
        if (cachedWeather && cachedTimestamp) {
          try {
            const timestamp = parseInt(cachedTimestamp);
            // 只使用1小时内的缓存数据
            if (Date.now() - timestamp < 60 * 60 * 1000) {
              const parsedWeather = JSON.parse(cachedWeather);
              if (validateWeatherData(parsedWeather)) {
                setWeather(parsedWeather);
                setError('使用缓存的天气数据');
              } else {
                throw new Error('缓存的天气数据无效');
              }
            }
          } catch (e) {
            console.error('Invalid cached weather data:', e);
            localStorage.removeItem('weather_data');
            localStorage.removeItem('weather_timestamp');
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