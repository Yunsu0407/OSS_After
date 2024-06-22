import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            try {
                const response = await axios.get(`http://localhost:8080/login`, 
                new URLSearchParams({
                    code: code
                }));
                const user = response.data;
                // 사용자 정보를 로컬 스토리지에 저장하고 메인 페이지로 리다이렉트
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/Main');
            } catch (error) {
                console.error('Failed to login', error);
            }
        };

        fetchUser();
    }, [navigate]);

    return <div>Loading...</div>;
};

export default Callback;
