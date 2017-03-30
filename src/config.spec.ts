import config from './config'


describe('config', ()=>{

    it('should accept defaults', () => {
        expect(config.get('foo', 'bar')).toEqual('bar')
    })
})