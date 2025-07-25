import { renderHook, waitFor } from '@testing-library/react';
import {
  TestWrapper,
  cleanupTestEnvironment,
  mockSessionNone,
  setupTestEnvironment,
} from '../../../test-utils/testWrapper';
import * as userLocationServiceModule from '../services/userLocationService';
import * as locationUtils from '../utils/location';
import { useUserLocation } from './useUserLocation';

// 모듈 전체를 모킹
jest.mock('../services/userLocationService');
jest.mock('../utils/location');

// 타입 안전성을 위한 모킹
const mockUserLocationService = userLocationServiceModule.userLocationService as jest.Mocked<
  typeof userLocationServiceModule.userLocationService
>;
const mockLocationUtils = locationUtils as jest.Mocked<typeof locationUtils>;

// 헬퍼 함수들
const mockLocationSuccess = () => {
  mockLocationUtils.getCurrentLocationData.mockResolvedValue({
    currentLocation: { lat: 37.5, lng: 127.0 },
    cityInfo: { city: 'Seoul', state: 'Seoul' },
  });
  mockUserLocationService.updateUserLocation.mockResolvedValue({});
};

const mockUsersSuccess = () => {
  mockUserLocationService.fetchNearbyUsers.mockResolvedValue([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ]);
};

const mockLocationError = () => {
  mockLocationUtils.getCurrentLocationData.mockRejectedValue(new Error('위치 에러'));
};

const mockUsersError = () => {
  mockUserLocationService.fetchNearbyUsers.mockRejectedValue(new Error('유저 에러'));
};

describe('useUserLocation', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  it('위치와 주변 유저를 정상적으로 fetch한다 (수동 실행)', async () => {
    mockLocationSuccess();
    mockUsersSuccess();

    const { result } = renderHook(() => useUserLocation(), { wrapper: TestWrapper });

    // 위치 fetch 강제 실행
    await result.current.updateLocation();

    // 위치 fetch 완료 대기
    await waitFor(() => expect(result.current.cityInfo).toBeDefined());
    expect(result.current.cityInfo).toEqual({ city: 'Seoul', state: 'Seoul' });
    expect(result.current.currentLocation).toEqual({ lat: 37.5, lng: 127.0 });

    // 주변 유저 fetch 완료 대기
    await waitFor(() => expect(result.current.users).toBeDefined());
    expect(result.current.users).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);

    // 모킹된 함수들이 호출되었는지 확인
    expect(mockLocationUtils.getCurrentLocationData).toHaveBeenCalled();
    expect(mockUserLocationService.updateUserLocation).toHaveBeenCalledWith(
      'Seoul',
      'Seoul',
      37.5,
      127,
    );
    expect(mockUserLocationService.fetchNearbyUsers).toHaveBeenCalledWith('Seoul', 'Seoul');
  });

  it('위치와 주변 유저를 자동으로 fetch한다 (enabled 플래그)', async () => {
    mockLocationSuccess();
    mockUsersSuccess();

    const { result } = renderHook(() => useUserLocation(), { wrapper: TestWrapper });

    // enabled 플래그로 자동 실행 대기
    await waitFor(() => expect(result.current.cityInfo).toBeDefined());
    expect(result.current.cityInfo).toEqual({ city: 'Seoul', state: 'Seoul' });
    expect(result.current.currentLocation).toEqual({ lat: 37.5, lng: 127.0 });

    await waitFor(() => expect(result.current.users).toBeDefined());
    expect(result.current.users).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);

    // enabled 플래그로 자동 실행되었는지 확인
    expect(mockLocationUtils.getCurrentLocationData).toHaveBeenCalled();
    expect(mockUserLocationService.updateUserLocation).toHaveBeenCalledWith(
      'Seoul',
      'Seoul',
      37.5,
      127,
    );
    expect(mockUserLocationService.fetchNearbyUsers).toHaveBeenCalledWith('Seoul', 'Seoul');
  });

  it('위치 fetch 중 에러가 발생하면 locationError가 반환되고 다른 함수들이 호출되지 않는다', async () => {
    mockLocationError();

    const { result } = renderHook(() => useUserLocation(), { wrapper: TestWrapper });

    await waitFor(() => expect(result.current.locationError).toBeDefined());

    // 위치 에러 발생 시 다른 비즈니스 함수들이 호출되지 않는지 확인
    expect(mockUserLocationService.updateUserLocation).not.toHaveBeenCalled();
    expect(mockUserLocationService.fetchNearbyUsers).not.toHaveBeenCalled();
  });

  it('주변 유저 fetch 중 에러가 발생하면 usersError가 반환되고 updateUserLocation은 호출된다', async () => {
    mockLocationSuccess();
    mockUsersError();

    const { result } = renderHook(() => useUserLocation(), { wrapper: TestWrapper });

    // 위치 데이터가 로드될 때까지 대기
    await waitFor(() => expect(result.current.cityInfo).toBeDefined());

    // 주변 유저 에러가 발생할 때까지 대기
    await waitFor(() => expect(result.current.usersError).toBeDefined());

    // 위치는 성공했으므로 updateUserLocation은 호출되어야 함
    expect(mockUserLocationService.updateUserLocation).toHaveBeenCalledWith(
      'Seoul',
      'Seoul',
      37.5,
      127,
    );
    // fetchNearbyUsers도 호출되었지만 에러가 발생
    expect(mockUserLocationService.fetchNearbyUsers).toHaveBeenCalledWith('Seoul', 'Seoul');
  });

  it('updateUserLocation 에러 시 fetchNearbyUsers가 호출되지 않는다', async () => {
    // 위치는 성공하지만 updateUserLocation에서 에러 발생
    mockLocationUtils.getCurrentLocationData.mockResolvedValue({
      currentLocation: { lat: 37.5, lng: 127.0 },
      cityInfo: { city: 'Seoul', state: 'Seoul' },
    });
    mockUserLocationService.updateUserLocation.mockRejectedValue(new Error('업데이트 에러'));

    const { result } = renderHook(() => useUserLocation(), { wrapper: TestWrapper });

    await waitFor(() => expect(result.current.locationError).toBeDefined());

    // updateUserLocation 에러 발생 시 fetchNearbyUsers가 호출되지 않는지 확인
    expect(mockUserLocationService.fetchNearbyUsers).not.toHaveBeenCalled();
  });

  it('세션이 없으면 쿼리가 실행되지 않는다', () => {
    mockSessionNone();

    const { result } = renderHook(() => useUserLocation(), { wrapper: TestWrapper });

    expect(result.current.cityInfo).toBeUndefined();
    expect(result.current.users).toBeUndefined();

    // 모킹된 함수들이 호출되지 않았는지 확인
    expect(mockLocationUtils.getCurrentLocationData).not.toHaveBeenCalled();
    expect(mockUserLocationService.updateUserLocation).not.toHaveBeenCalled();
    expect(mockUserLocationService.fetchNearbyUsers).not.toHaveBeenCalled();
  });
});
